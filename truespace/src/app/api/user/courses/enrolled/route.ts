import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Course } from '@/models/Course';
import { UserCourseAccess } from '@/models/UserCourseAccess';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    // Find all courses the user has access to
    const userAccess = await UserCourseAccess.find({ userId: session.user.id });
    
    if (!userAccess.length) {
      return NextResponse.json([]);
    }
    
    // Get course IDs from user access records
    const courseIds = userAccess.map(access => access.courseId);
    
    // Find all courses with these IDs
    const courses = await Course.find({ _id: { $in: courseIds } }).sort({ createdAt: -1 });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrolled courses' },
      { status: 500 }
    );
  }
} 