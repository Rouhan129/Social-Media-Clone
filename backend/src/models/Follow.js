import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  followingId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model("Follow", followSchema);
