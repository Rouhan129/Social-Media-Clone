import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { signAccessToken, signRefreshToken } from "../utils/generateToken.js";

const router = express.Router()

router.post("/register", async (req, res) => {
    const {email, password, role } = req.body

    const exists = await User.findOne({email})

    if (exists){
        return res.status(400).json({message: "User already exists!"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({email, password: hashedPassword, role})

    const payload = {id: user._id, role: user.role}
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    user.refreshToken = refreshToken
    await user.save()

    res.json({accessToken, refreshToken, userId: user._id})
})

router.post("/login", async (req, res) => {
    const { email, password} = req.body;

    const user = await User.findOne({email})

    if (!user){
        return res.status(404).json({message: "User does not exists!"})
    }

    const match = bcrypt.compare(password, user.password)

    if (!match) {
        return res.status(400).json({message: "Invalid Credentials!"})
    }

    const payload = {id: user._id, role: user.role}
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    user.refreshToken = refreshToken
    user.save()

    res.json({ accessToken, refreshToken, userId: user._id });
})


router.post("/refresh", async (req, res) => {
    const {token} = req.body

    if (!token){
        return res.status(404).json({message: "Refresh Token required!"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch (err) {
        return res.status(400).json({message: "Refresh Token Invalid!"})
    }

    const user = await User.findById(decoded.id)
    if (!user){
        return res.status(404).json({message: "User not found!"})
    }

    const payload = {id: user._id, role: user.role}
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload)

    user.refreshToken = refreshToken

    await user.save();

    res.json({accessToken, refreshToken})
})

export default router