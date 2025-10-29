import express from "express"
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import upload from "../middleware/upload.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.post("/", protect, upload.single('image'), async (req, res) => {

    console.log(req.user.id)
    try {
        if (!req.file){
            return res.status(400).json({message: "File is missing!"})
        }

        const post = await Post.create({
            title: req.body.title,
            desc: req.body.desc,
            image: `uploads/${req.file.filename}`,
            user: req.user.id
        })

        res.status(200).json({message: "Posted Successfully!", post})
    }catch(err){
        console.log("Error: ", err)
        res.status(400).json({message: "Failed to create post"})
    }
})


router.get('/', protect, async (req, res) => {
    try{
        const posts = await Post.find({user: req.user.id})
        res.status(200).json(posts)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

// Get All Posts
router.get('/all', protect, async (req, res) => {
    try{
        const posts = await Post.find().populate('user', 'email')

        const postwithComments = await Promise.all(
            posts.map(async (post) => {
                const comments = await Comment.find({postId: post._id}).populate("userId", "email").lean()

                return {...post.toObject(), comments}
            })
        )


        res.status(200).json(postwithComments)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

export default router