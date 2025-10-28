import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js"


dotenv.config()
connectDB();

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())


app.get("/", (req, res) => {
    res.send("Testing Route")
})

app.use("/api/auth", authRoutes)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})