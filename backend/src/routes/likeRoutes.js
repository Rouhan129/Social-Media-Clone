import express from "express";
import Like from "../models/Like.js"
import {protect} from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ message: "Post disliked", liked: false });
    } else {
      await Like.create({ postId, userId });
      return res.json({ message: "Post liked", liked: true });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.get("/:postId", protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const count = await Like.countDocuments({ postId });
    const isLiked = await Like.exists({ postId, userId });

    res.json({
      postId,
      likes: count,
      isLikedByUser: !!isLiked,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

export default router;
