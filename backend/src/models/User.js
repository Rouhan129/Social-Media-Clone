import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, require: true},
    role: {
        type: String,
        enum: ["user", "admin", "moderator"],
        default: "user"
    },
    refreshToken: {type: String}
}, {timestamps: true})

export default mongoose.model("User", userSchema)