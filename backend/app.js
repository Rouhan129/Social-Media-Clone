import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js"
import postRoutes from "./src/routes/postRoutes.js"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config()
connectDB();

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

app.use('/uploads', express.static(path.join(dirname, 'public')))


app.get("/", (req, res) => {
    res.send("Testing Route")
})

app.use("/api/auth", authRoutes)

app.use('/api/post', postRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})