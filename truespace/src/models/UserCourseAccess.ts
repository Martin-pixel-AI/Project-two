import mongoose, { Schema, models } from 'mongoose';

export interface IUserCourseAccess {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  promoCodeId: mongoose.Types.ObjectId;
  grantedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userCourseAccessSchema = new Schema<IUserCourseAccess>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    promoCodeId: {
      type: Schema.Types.ObjectId,
      ref: 'PromoCode',
      required: true,
    },
    grantedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add compound index for checking if a user has access to a course
userCourseAccessSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserCourseAccess = models.UserCourseAccess || mongoose.model<IUserCourseAccess>('UserCourseAccess', userCourseAccessSchema); 