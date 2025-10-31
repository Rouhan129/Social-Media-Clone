import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {type: mongoose.Schema.ObjectId, ref: 'Post', required: true},
    userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    text: {type: String, required: true},
    parentComment: {type: String, default: null}
}, {timestamps: true})

export default mongoose.model("Comment", commentSchema)