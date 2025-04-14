import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to view this video' },
        { status: 401 }
      );
    }
    
    const { videoId, courseId } = await request.json();
    
    if (!videoId || !courseId) {
      return NextResponse.json(
        { error: 'Video ID and Course ID are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if user has access to this course
    const userCourseAccess = await db.collection('userCourseAccess').findOne({
      userId: new ObjectId(session.user.id),
      courseId: new ObjectId(courseId),
      hasAccess: true
    });
    
    // If no access record found, check if the video is free
    if (!userCourseAccess) {
      const course = await db.collection('courses').findOne(
        { _id: new ObjectId(courseId) },
        { projection: { videos: 1 } }
      );
      
      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
      
      const video = course.videos.find((v: any) => 
        v._id.toString() === videoId || v._id.equals(new ObjectId(videoId))
      );
      
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }
      
      if (!video.isFree) {
        return NextResponse.json(
          { error: 'You do not have access to this video' },
          { status: 403 }
        );
      }
    }
    
    // Record the video view
    await db.collection('videoViews').updateOne(
      {
        userId: new ObjectId(session.user.id),
        videoId: new ObjectId(videoId),
        courseId: new ObjectId(courseId)
      },
      {
        $setOnInsert: {
          userId: new ObjectId(session.user.id),
          videoId: new ObjectId(videoId),
          courseId: new ObjectId(courseId),
          firstViewedAt: new Date()
        },
        $set: {
          lastViewedAt: new Date()
        },
        $inc: {
          viewCount: 1
        }
      },
      { upsert: true }
    );
    
    // Update user's last activity
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          lastActive: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking video view:', error);
    return NextResponse.json(
      { error: 'Failed to track video view' },
      { status: 500 }
    );
  }
} 