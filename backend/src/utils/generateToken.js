import jwt from "jsonwebtoken"

export const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}


export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN})
}


export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}