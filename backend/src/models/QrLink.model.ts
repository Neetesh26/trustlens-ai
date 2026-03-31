import { Schema, model, Document, Types } from "mongoose";

export interface IQrLink extends Document {
  userId: Types.ObjectId;
  url: string;
  size: string;
  color?: string;
  bgcolor?: string;
  createdAt: Date;
}

const QrLinkSchema = new Schema<IQrLink>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    url: { type: String, required: true },
    size: { type: String, default: "300x300" },
    color: { type: String },
    bgcolor: { type: String },
  },
  { timestamps: true }
);

QrLinkSchema.index({ userId: 1, createdAt: -1 });

export const QrLink = model<IQrLink>("QrLink", QrLinkSchema);