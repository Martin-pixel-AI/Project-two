import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { PromoCode } from '@/models/PromoCode';
import { UserCourseAccess } from '@/models/UserCourseAccess';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find the promo code
    const promoCode = await PromoCode.findOne({ code, isActive: true });
    
    if (!promoCode) {
      return NextResponse.json(
        { error: 'Invalid or inactive promo code' },
        { status: 404 }
      );
    }
    
    // Check if promo code is expired
    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Promo code has expired' },
        { status: 400 }
      );
    }
    
    // Check if promo code reached maximum uses
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: 'Promo code has reached maximum usage limit' },
        { status: 400 }
      );
    }
    
    // Check if user already has access to this course
    const existingAccess = await UserCourseAccess.findOne({
      userId: session.user.id,
      courseId: promoCode.courseId,
    });
    
    if (existingAccess) {
      return NextResponse.json(
        { error: 'You already have access to this course', courseId: promoCode.courseId },
        { status: 409 }
      );
    }
    
    // Grant access to the user
    await UserCourseAccess.create({
      userId: session.user.id,
      courseId: promoCode.courseId,
      promoCodeId: promoCode._id,
      grantedAt: new Date(),
    });
    
    // Increment used count
    promoCode.usedCount += 1;
    await promoCode.save();
    
    return NextResponse.json({
      message: 'Promo code applied successfully',
      courseId: promoCode.courseId,
    });
  } catch (error) {
    console.error('Error applying promo code:', error);
    return NextResponse.json(
      { error: 'Failed to apply promo code' },
      { status: 500 }
    );
  }
} 