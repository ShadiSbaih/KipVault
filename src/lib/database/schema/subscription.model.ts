import mongoose, { Model, Schema } from "mongoose";
import { Document } from "mongoose";

export interface ISubscription {
  subscriber: mongoose.Types.ObjectId | string; // User who owns the storage quota
  selectedStorage: number; // Storage in Bytes
  usedStorage: number; // Storage in Bytes
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionModel extends ISubscription, Document {}

const subscriptionSchema: Schema<SubscriptionModel> = new Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedStorage: { type: Number, required: true, default: 16105174016 }, // in Bytes
    usedStorage: { type: Number, required: true, default: 0 }, // in Bytes
  },
  { timestamps: true }
);

export const Subscription: Model<SubscriptionModel> =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionModel>("Subscription", subscriptionSchema);
