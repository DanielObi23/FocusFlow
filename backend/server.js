import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"


dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))

app.get("/api/profile", (req, res) => {
    res.json({
        message: "Welcome to the FocusFlow Profile page"
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})