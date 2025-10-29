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

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Like.countDocuments({ postId });
    res.json({ postId, likes: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch likes" });
  }
});

export default router;
