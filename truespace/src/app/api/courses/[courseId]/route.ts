import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { Video } from '@/models/Video';
import { UserCourseAccess } from '@/models/UserCourseAccess';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Find videos for this course
    const videos = await Video.find({ courseId }).sort({ order: 1 });
    
    // Check if the user has access to this course
    const session = await getServerSession(authOptions);
    let hasAccess = false;
    
    if (session?.user?.id) {
      const access = await UserCourseAccess.findOne({
        userId: session.user.id,
        courseId,
      });
      
      hasAccess = !!access;
    }
    
    // Return course with videos and access info
    const courseWithVideos = {
      ...course.toObject(),
      videos,
      hasAccess,
    };
    
    return NextResponse.json(courseWithVideos);
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course details' },
      { status: 500 }
    );
  }
} 