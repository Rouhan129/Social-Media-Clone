import express from "express"

import User from "../models/User.js"
import Post from "../models/Post.js"
import Follow from "../models/Follow.js"

import { protect } from "../middleware/auth.js"

const router = express.Router()

// Get user data
router.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({message: "User not found!"});
        res.json(user)
    }catch(err){
        console.log("Error: ", err)
        res.status(500).json({message: "Something went wrong!"})
    }
})

// Get posts by user id
router.get('/:id/post', async (req, res) => {
    try {
        const posts = await Post.find({user: req.params.id})
        if (!posts) return res.status(400).json({message: 'Posts not found'})
            res.status(200).json(posts)
    }catch(err){
        console.log("Error: ", err)
        res.status(500).json({message: "Something went wrong!"})
    }
})

// Follow Status
router.get('/follow/:id', protect, async (req, res) => {
    try {
        const userPresent = await User.findById(req.params.id)
        if (!userPresent) return res.status(404).json({message: "User not found!"});

        const status = await Follow.findOne({followerId: req.user.id, followingId: req.params.id})

        res.json({isFollowing: Boolean(status)})
    }catch(err){
        res.status(500).json({message: "Something went wrong."})
    }
})

// Follow/UnFollow a user (Toggle Functionality)
router.post('/follow/:id', protect, async (req, res) => {
    try {
        const userPresent = await User.findById(req.params.id)
        if (!userPresent) return res.status(404).json({message: "User not found!"});

        const status = await Follow.findOne({followerId: req.user.id, followingId: req.params.id})

        if (!status) {
            const follow = await Follow.create({
                followerId: req.user.id,
                followingId: req.params.id
            })
            res.status(200).json({message: "User followed!"})
        }else {
            const unFollow = await Follow.deleteOne({
                followerId: req.user.id,
                followingId: req.params.id
            })
            res.status(200).json({message: "User unfollowed!"})
        }
    }catch(err){
        console.log("Error: ", err)
        res.status(400).json({message: "Something went wrong!"})
    }
})

export default router