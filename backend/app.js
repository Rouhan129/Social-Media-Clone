import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js";


dotenv.config()
connectDB();

const app = express()
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Testing Route")
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`)
})