import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Find all in-progress videos for the current user
    // We'll get videos that have progress but are not completed
    // Limit to the most recent 6 videos
    const progressRecords = await db.collection('videoProgress')
      .find({
        userId: new ObjectId(session.user.id),
        completed: false,
        currentTime: { $gt: 0 } // Only get videos with some progress
      })
      .sort({ lastUpdated: -1 })
      .limit(6)
      .toArray();
      
    if (!progressRecords || progressRecords.length === 0) {
      return NextResponse.json([]);
    }
    
    // Get video and course details for each progress record
    const videoIds = progressRecords.map(record => new ObjectId(record.videoId));
    const courseIds = progressRecords.map(record => new ObjectId(record.courseId));
    
    const videos = await db.collection('videos')
      .find({ _id: { $in: videoIds } })
      .toArray();
      
    const courses = await db.collection('courses')
      .find({ _id: { $in: courseIds } })
      .toArray();
    
    // Combine data to create the response
    const inProgressVideos = progressRecords.map(progress => {
      const video = videos.find(v => v._id.toString() === progress.videoId.toString());
      const course = courses.find(c => c._id.toString() === progress.courseId.toString());
      
      if (!video || !course) return null;
      
      return {
        _id: progress._id.toString(),
        videoId: progress.videoId.toString(),
        courseId: progress.courseId.toString(),
        videoTitle: video.title,
        courseName: course.title,
        thumbnail: video.thumbnail,
        currentTime: progress.currentTime,
        duration: progress.duration,
        completed: progress.completed,
        lastUpdated: progress.lastUpdated
      };
    }).filter(Boolean); // Remove any null entries
    
    return NextResponse.json(inProgressVideos);
  } catch (error) {
    console.error('Error getting in-progress videos:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve in-progress videos' },
      { status: 500 }
    );
  }
} 