import mongoose, { Schema, models } from 'mongoose';

export interface IVideo {
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoType: 'youtube' | 'custom';
  youtubeId?: string;
  duration: number;
  courseId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
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
    videoUrl: {
      type: String,
      required: true,
    },
    videoType: {
      type: String,
      enum: ['youtube', 'custom'],
      default: 'youtube',
    },
    youtubeId: {
      type: String,
      // Extract YouTube ID from URL using a pre-save hook
    },
    duration: {
      type: Number,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to extract YouTube ID from URL
videoSchema.pre('save', function(next) {
  if (this.videoType === 'youtube' && this.videoUrl) {
    // Extract YouTube ID from various URL formats
    const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const match = this.videoUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      this.youtubeId = match[1];
    }
  }
  next();
});

export const Video = models.Video || mongoose.model<IVideo>('Video', videoSchema); 