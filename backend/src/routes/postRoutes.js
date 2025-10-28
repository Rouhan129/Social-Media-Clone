import express from "express"
import Post from "../models/Post.js"
import upload from "../middleware/upload.js"

const router = express.Router()

router.post("/", upload.single('image'), async (req, res) => {
    try {
        if (!req.file){
            return res.status(400).json({message: "File is missing!"})
        }

        const post = Post.create({
            title: req.body.title,
            desc: req.body.desc,
            image: `/${req.file.filename}`
        })

        res.status(200).json({message: "Posted Successfully!"})
    }catch(err){
        res.status(400).json({message: err.message})
    }
})


router.get('/', async (req, res) => {
    try{
        const posts = await Post.find()
        res.status(200).json(posts)
    }catch(error){
        res.status(400).json({message: error.message})
    }

})

export default router