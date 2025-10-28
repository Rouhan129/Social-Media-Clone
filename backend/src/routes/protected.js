import express from "express";
import { protect, authorize} from "../middleware/auth.js"

const router = express.Router()

router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({message: "Hello Admin!"})
})