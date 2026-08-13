import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  productId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  body: { type: String, required: true },
  helpful: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
