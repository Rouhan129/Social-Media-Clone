const express = require("express")

const app = express()

const port = 5000;

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Testing Route")
})

app.listen(port, () => {
    console.log(`Server running at port: ${port}`)
})