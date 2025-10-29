import express from "express";
import { protect } from "../middleware/auth.js";
import Comment from "../models/Comment.js";

const router = express.Router()

router.post('/', protect, async (req, res) => {
    const {postId, text, parentComment} = req.body;
    const userId = req.user.id;

    if(!postId) return res.status(400).json({message: "Mention the Post."});
    if(!userId) return res.status(400).json({message: "Mention the User."});
    if(!text) return res.status(400).json({message: "Mention the Text."});

    try{
        const comment = await Comment.create({
            postId,
            userId,
            text,
            parentComment: parentComment || null
        })

        return res.status(200).json({message: "Comment created successfully", comment})
    }catch(err){
        console.log("Error: ", err)
        return res.status(400).json({message: "Something went wrong!"})
    }
})


export default router