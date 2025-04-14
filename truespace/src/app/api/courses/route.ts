import { NextRequest, NextResponse } from 'next/server';
import { Course } from '@/models/Course';
import { UserCourseAccess } from '@/models/UserCourseAccess';
import connectDB from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    
    let filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ];
    }
    
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
    // If user is logged in, check which courses they have access to
    const coursesWithAccessInfo = await Promise.all(
      courses.map(async (course) => {
        let hasAccess = false;
        
        if (session?.user?.id) {
          const access = await UserCourseAccess.findOne({
            userId: session.user.id,
            courseId: course._id,
          });
          
          hasAccess = !!access;
        }
        
        return {
          ...course.toObject(),
          hasAccess,
        };
      })
    );
    
    return NextResponse.json(coursesWithAccessInfo);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
} 