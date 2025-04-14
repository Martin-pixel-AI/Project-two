import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Find the user and get their saved courses
    const user = await User.findById(session.user.id);
    
    if (!user || !user.savedCourses.length) {
      return NextResponse.json([]);
    }
    
    // Find all courses with these IDs
    const courses = await Course.find({ _id: { $in: user.savedCourses } }).sort({ createdAt: -1 });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching saved courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved courses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { courseId } = await req.json();
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if course exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Add course to user's saved courses if not already saved
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.savedCourses.includes(courseId)) {
      return NextResponse.json(
        { error: 'Course already saved' },
        { status: 409 }
      );
    }
    
    user.savedCourses.push(courseId);
    await user.save();
    
    return NextResponse.json({ message: 'Course saved successfully' });
  } catch (error) {
    console.error('Error saving course:', error);
    return NextResponse.json(
      { error: 'Failed to save course' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Remove course from user's saved courses
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.savedCourses.includes(courseId)) {
      return NextResponse.json(
        { error: 'Course not in saved list' },
        { status: 404 }
      );
    }
    
    user.savedCourses = user.savedCourses.filter((id: mongoose.Types.ObjectId) => id.toString() !== courseId);
    await user.save();
    
    return NextResponse.json({ message: 'Course removed from saved list' });
  } catch (error) {
    console.error('Error removing saved course:', error);
    return NextResponse.json(
      { error: 'Failed to remove course from saved list' },
      { status: 500 }
    );
  }
} 