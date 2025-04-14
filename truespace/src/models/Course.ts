import mongoose, { Schema, models } from 'mongoose';

export interface ICourse {
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  instructor: string;
  tags: string[];
  videos: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    videos: [{
      type: Schema.Types.ObjectId,
      ref: 'Video',
    }],
  },
  { timestamps: true }
);

export const Course = models.Course || mongoose.model<ICourse>('Course', courseSchema); 