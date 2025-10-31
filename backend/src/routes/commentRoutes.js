import express from "express";
import { protect } from "../middleware/auth.js";
import Comment from "../models/Comment.js";

const router = express.Router()

router.post("/", protect, async (req, res) => {
  try {
    const { postId, text, parentComment } = req.body;
    const userId = req.user.id;

    if (!postId) return res.status(400).json({ message: "Mention the Post." });
    if (!userId) return res.status(400).json({ message: "Mention the User." });
    if (!text) return res.status(400).json({ message: "Mention the Text." });

    const comment = await Comment.create({
      postId,
      userId,
      text,
      parentComment: parentComment || null,
    });

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(400).json({ message: "Something went wrong!" });
  }
});


export default router