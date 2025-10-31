import express from "express";
import Follow from "../models/Follow.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (followerId.toString() === userId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    await Follow.create({ followerId, followingId: userId });
    res.json({ message: "Followed successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already following this user" });
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    await Follow.findOneAndDelete({ followerId, followingId: userId });
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/following/:userId", async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.params.userId })
      .populate("followingId", "email");
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/followers/:userId", async (req, res) => {
  try {
    const followers = await Follow.find({ followingId: req.params.userId })
      .populate("followerId", "email");
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
