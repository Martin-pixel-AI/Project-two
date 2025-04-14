import mongoose, { Schema, models } from 'mongoose';

export interface IPromoCode {
  code: string;
  courseId: mongoose.Types.ObjectId;
  expiresAt?: Date;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    maxUses: {
      type: Number,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Удаляем дублирующий индекс, так как поле code уже имеет unique: true
// promoCodeSchema.index({ code: 1 });

export const PromoCode = models.PromoCode || mongoose.model<IPromoCode>('PromoCode', promoCodeSchema); 