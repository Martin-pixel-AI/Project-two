import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId, Document } from 'mongodb';

// Define interface for video progress records
interface VideoProgress {
  _id: ObjectId;
  userId: ObjectId;
  videoId: ObjectId;
  courseId: ObjectId;
  progress: number;
  completed: boolean;
  updatedAt: Date;
}

// GET handler to retrieve video progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const courseId = searchParams.get('courseId');

    if (!videoId || !courseId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Check if user has progress record for this video
    const progress = await db.collection('videoProgress').findOne({
      userId: new ObjectId(session.user.id),
      videoId: new ObjectId(videoId),
      courseId: new ObjectId(courseId)
    });

    if (!progress) {
      return NextResponse.json({ 
        currentTime: 0, 
        duration: 0, 
        completed: false 
      });
    }

    return NextResponse.json({
      currentTime: progress.currentTime || 0,
      duration: progress.duration || 0,
      completed: progress.completed || false
    });
  } catch (error) {
    console.error('Error getting video progress:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve video progress' },
      { status: 500 }
    );
  }
}

// POST handler to update video progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, courseId, currentTime, duration, completed } = body;

    if (!videoId || !courseId || currentTime === undefined || duration === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Check if user has access to this course
    const userCourseAccess = await db.collection('userCourseAccess').findOne({
      userId: new ObjectId(session.user.id),
      courseId: new ObjectId(courseId)
    });

    // Check if the video is free
    const video = await db.collection('videos').findOne({
      _id: new ObjectId(videoId)
    });

    if (!userCourseAccess && !video?.isFree) {
      return NextResponse.json({ error: 'No access to this course' }, { status: 403 });
    }

    // Update or insert progress
    const result = await db.collection('videoProgress').updateOne(
      {
        userId: new ObjectId(session.user.id),
        videoId: new ObjectId(videoId),
        courseId: new ObjectId(courseId)
      },
      {
        $set: {
          currentTime,
          duration,
          completed: completed || false,
          lastUpdated: new Date()
        }
      },
      { upsert: true }
    );

    // If this video is now completed, check if all videos in the course are completed
    if (completed) {
      // Get all videos for this course
      const course = await db.collection('courses').findOne({
        _id: new ObjectId(courseId)
      });

      if (course && course.videos && course.videos.length > 0) {
        // Get progress for all videos in this course
        const allProgressRecords = await db.collection('videoProgress')
          .find({
            userId: new ObjectId(session.user.id),
            courseId: new ObjectId(courseId),
            completed: true
          })
          .toArray() as VideoProgress[];

        // Check if all videos are completed
        const completedVideoIds = allProgressRecords.map((record) => 
          record.videoId.toString()
        );
        const allVideosCompleted = course.videos.every((vid: string | ObjectId) => 
          completedVideoIds.includes(vid.toString())
        );

        if (allVideosCompleted) {
          // Update user course access to mark the course as completed
          await db.collection('userCourseAccess').updateOne(
            {
              userId: new ObjectId(session.user.id),
              courseId: new ObjectId(courseId)
            },
            {
              $set: {
                completed: true,
                completedAt: new Date()
              }
            }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating video progress:', error);
    return NextResponse.json(
      { error: 'Failed to update video progress' },
      { status: 500 }
    );
  }
} 