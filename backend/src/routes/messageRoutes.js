import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all messages between two users
router.get("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id; // From protect middleware

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest first

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;