import { verifyToken } from "../utils/generateToken.js";

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({ message: "NO TOKEN, NO ENTRY!"})
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = verifyToken(token)
        req.user = decoded;
        next()
    }catch(err){
        return res.status(400).json({message: "Token is not valid!"})
    }
}

export const authorize = async (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return res.status(403).json({message: "User not authorized for this role."})
        }
        next();
    }
}