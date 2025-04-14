import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateS3Key, generateUploadUrl } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can upload videos.' },
        { status: 401 }
      );
    }

    const { fileName, fileType } = await req.json();
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and file type are required' },
        { status: 400 }
      );
    }

    // Generate a unique S3 key
    const key = generateS3Key('videos', fileName);
    
    // Generate a pre-signed URL for uploading
    const uploadUrl = await generateUploadUrl(key, fileType);
    
    return NextResponse.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
} 