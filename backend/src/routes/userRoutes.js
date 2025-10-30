import express from "express"

import User from "../models/User.js"
import Post from "../models/Post.js"
import Follow from "../models/Follow.js"
import Comment from "../models/Comment.js"

import { protect } from "../middleware/auth.js"

const router = express.Router()

// get posts of followed users
router.get('/feed', protect, async (req, res) => {
    try {
        const followingUsers = await Follow.find({ followerId: req.user.id }).select('followingId')
        if (!followingUsers || followingUsers.length === 0) {
            return res.status(200).json([])
        }

        const followerIds = followingUsers.map(user => user.followingId)

        const posts = await Post.find({ user: { $in: followerIds } }).sort({ createdAt: -1 }).populate('user', 'email')

        const postWithComments = await Promise.all(
            posts.map(async (post) => {
                const comments = await Comment.find({ postId: post._id }).populate('userId', 'email').lean()

                return { ...post.toObject(), comments }
            })
        )

        res.status(200).json(postWithComments)
    } catch (err) {
        console.log("Error: ", err)
        res.status(400).json({ message: "Something went wrong!" })
    }
})

// get followed users
router.get('/following', protect, async (req, res) => {
  try {
    const follows = await Follow.find({ followerId: req.user.id })
      .populate("followingId", "_id email role"); // populate followed user info

    // Extract the followed user objects
    const followedUsers = follows.map(f => f.followingId);

    res.status(200).json(followedUsers);
  } catch (err) {
    console.error("Error fetching followed users:", err);
    res.status(500).json({ message: "Failed to fetch followed users" });
  }
});


// Get user data
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found!" });
        res.json(user)
    } catch (err) {
        console.log("Error: ", err)
        res.status(500).json({ message: "Something went wrong!" })
    }
})

// Get posts by user id
router.get('/:id/post', async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
        if (!posts) return res.status(400).json({ message: 'Posts not found' })
        res.status(200).json(posts)
    } catch (err) {
        console.log("Error: ", err)
        res.status(500).json({ message: "Something went wrong!" })
    }
})

// Follow Status
router.get('/follow/:id', protect, async (req, res) => {
    try {
        const userPresent = await User.findById(req.params.id)
        if (!userPresent) return res.status(404).json({ message: "User not found!" });

        const status = await Follow.findOne({ followerId: req.user.id, followingId: req.params.id })

        res.json({ isFollowing: Boolean(status) })
    } catch (err) {
        res.status(500).json({ message: "Something went wrong." })
    }
})

// Follow/UnFollow a user (Toggle Functionality)
router.post('/follow/:id', protect, async (req, res) => {
    try {
        const userPresent = await User.findById(req.params.id)
        if (!userPresent) return res.status(404).json({ message: "User not found!" });

        const status = await Follow.findOne({ followerId: req.user.id, followingId: req.params.id })

        if (!status) {
            const follow = await Follow.create({
                followerId: req.user.id,
                followingId: req.params.id
            })
            res.status(200).json({ message: "User followed!" })
        } else {
            const unFollow = await Follow.deleteOne({
                followerId: req.user.id,
                followingId: req.params.id
            })
            res.status(200).json({ message: "User unfollowed!" })
        }
    } catch (err) {
        console.log("Error: ", err)
        res.status(400).json({ message: "Something went wrong!" })
    }
})


export default router