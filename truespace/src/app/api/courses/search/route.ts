import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categories = searchParams.getAll('categories');
    const levels = searchParams.getAll('levels');
    
    const { db } = await connectToDatabase();
    
    // Build query filters
    const filters: any = {};
    
    // Text search if query is provided
    if (query && query.trim() !== '') {
      filters.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'instructor.name': { $regex: query, $options: 'i' } }
      ];
    }
    
    // Category filters
    if (categories && categories.length > 0) {
      filters.category = { $in: categories };
    }
    
    // Level filters
    if (levels && levels.length > 0) {
      filters.level = { $in: levels };
    }
    
    // Get courses
    const courses = await db.collection('courses')
      .aggregate([
        { $match: filters },
        {
          $lookup: {
            from: 'users',
            localField: 'instructorId',
            foreignField: '_id',
            as: 'instructorInfo'
          }
        },
        {
          $lookup: {
            from: 'videos',
            localField: '_id',
            foreignField: 'courseId',
            as: 'videos'
          }
        },
        {
          $addFields: {
            instructor: {
              $cond: {
                if: { $gt: [{ $size: '$instructorInfo' }, 0] },
                then: {
                  name: { $arrayElemAt: ['$instructorInfo.name', 0] },
                  email: { $arrayElemAt: ['$instructorInfo.email', 0] },
                  _id: { $arrayElemAt: ['$instructorInfo._id', 0] }
                },
                else: {
                  name: 'Unknown Instructor',
                  email: '',
                  _id: null
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            price: 1,
            category: 1,
            level: 1,
            imageUrl: 1,
            instructor: 1,
            createdAt: 1,
            videos: {
              _id: 1,
              title: 1
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();
    
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search courses' },
      { status: 500 }
    );
  }
} 