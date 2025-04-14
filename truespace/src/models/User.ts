import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin';
  favoriteVideos: mongoose.Types.ObjectId[];
  savedCourses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favoriteVideos: [{
      type: Schema.Types.ObjectId,
      ref: 'Video',
    }],
    savedCourses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>('User', userSchema); 