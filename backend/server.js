import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
// import { dirname, join } from "path"
// import { fileURLToPath } from "url"
import { sql } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"


dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// const __dirname = dirname(fileURLToPath(import.meta.url))
// app.use("/static", express.static(path.join(__dirname, "public")))

const corsOptions = {credentials:true, origin: process.env.URL || '*'}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(morgan("dev"))


app.use("/api/auth", authRoutes)
app.get("/api/profile", (req, res) => {
    res.json({
        message: "Welcome to the FocusFlow Profile page"
    })
})

async function initDB() {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
        await sql`
            CREATE TABLE IF NOT EXISTS users (
            user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            password_reset_token VARCHAR(255),
            password_reset_expires TIMESTAMP,
            google_id VARCHAR(255) UNIQUE,
            linkedin_id VARCHAR(255) UNIQUE,
            profile_image_url VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP WITH TIME ZONE,
            is_active BOOLEAN DEFAULT TRUE,
            role VARCHAR(50) DEFAULT 'user'
        )`
        console.log("Database initialized successfully")
    } catch (err) {
        console.log("Failed to initialize database:", err)
    }
}

initDB().then(() => {        
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
});