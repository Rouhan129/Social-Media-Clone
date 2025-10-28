import jwt from "jsonwebtoken"

export const signAccessToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}


export const signRefreshToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN})
}


export const verifyToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}