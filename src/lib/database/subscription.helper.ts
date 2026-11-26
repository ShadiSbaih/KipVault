import mongoose from "mongoose";
import db from "./db";
import { File } from "./schema/file.model";
import { Subscription } from "./schema/subscription.model";
import {
  DEFAULT_STORAGE_LIMIT,
  LEGACY_DEFAULT_STORAGE_LIMIT,
} from "@/lib/contants";

/**
 * Recomputes total bytes used by summing all File documents owned by `userId`.
 */
export async function recalculateUsedStorage(userId: string): Promise<number> {
  const ownerId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const [agg] = await File.aggregate<{ totalSize: number }>([
    { $match: { "userInfo.id": ownerId } },
    { $group: { _id: null, totalSize: { $sum: "$size" } } },
  ]);

  return agg?.totalSize ?? 0;
}

/**
 * Loads the user's Subscription, migrating legacy 15 GB defaults to 1 GB and
 * reconciling `usedStorage` against actual File records in MongoDB.
 */
export async function syncAndGetSubscription(userId: string) {
  await db();

  const actualUsedStorage = await recalculateUsedStorage(userId);
  let subs = await Subscription.findOne({ subscriber: userId });

  if (!subs) {
    subs = await Subscription.create({
      subscriber: userId,
      selectedStorage: DEFAULT_STORAGE_LIMIT,
      usedStorage: actualUsedStorage,
    });
    return subs;
  }

  const updates: Partial<{ selectedStorage: number; usedStorage: number }> = {};

  if (subs.selectedStorage === LEGACY_DEFAULT_STORAGE_LIMIT) {
    updates.selectedStorage = DEFAULT_STORAGE_LIMIT;
  }

  if (subs.usedStorage !== actualUsedStorage) {
    updates.usedStorage = actualUsedStorage;
  }

  if (Object.keys(updates).length > 0) {
    subs = await Subscription.findOneAndUpdate(
      { _id: subs._id },
      { $set: updates },
      { new: true }
    );
  }

  return subs!;
}
