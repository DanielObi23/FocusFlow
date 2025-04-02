import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import initDB from "./config/dbInit.js";
import { aj, ajStrict } from "./lib/arcjet.js";
import {sql} from "./config/db.js";
import sendEmail from "./utils/sendEmail.js";

import learningPathRoutes from "./routes/learningPathRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")))

const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend/dist")))

// applying arcjet rate limiting, shield and bot detection to all routes
app.use("/api", async (req, res, next) => {
    try {
        if (req.path.startsWith("/login") || req.path.startsWith("/auth")) {
            return next(); // Skip protection for authentication
        }
        const decision = await aj.protect(req, {
            requested: 1 
        })
        
        if (decision.isDenied()) {
            if(decision.reason && decision.reason.isRateLimit()) {
                res.status(429).json({ message: "Too many requests, please try again later." });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ message: "Bot access denied" });
            } else {
                res.status(403).json({ message: "Access denied" });
            }
            return;
        }

        // check for spoofed bots
        if (decision.results && decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ message: "Spoofed bot access denied" });
            return;
        }

        next();
    } catch (err) {
        //console.log("Arcjet error", err);
        next(err)
    }
})
app.use("/api/ai", async (req, res, next) => {
    try {
        if (req.path.startsWith("/login") || req.path.startsWith("/auth")) {
            return next(); // Skip protection for authentication
        }
        const decision = await ajStrict.protect(req, {
            requested: 1 
        })
        
        if (decision.isDenied()) {
            if(decision.reason && decision.reason.isRateLimit()) {
                res.status(429).json({ message: "Too many requests, please try again later." });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ message: "Bot access denied" });
            } else {
                res.status(403).json({ message: "Access denied" });
            }
            return;
        }

        // check for spoofed bots
        if (decision.results && decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ message: "Spoofed bot access denied" });
            return;
        }

        next();
    } catch (err) {
        //console.log("Arcjet error", err);
        next(err)
    }
})

// applying arcjet rate limiting, shield and bot detection to all ai routes
app.use("/api/ai", learningPathRoutes)

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/skills", skillRoutes);

app.post('/api/sendFeedback', async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        sendEmail({
            myEmail: process.env.MY_EMAIL,
            subject,
            text: message,
            html: `Feedback from ${email}: <br/> <br/>${message}`,
            name: "user"
        })
        res.status(200).json({message: "Feedback sent"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
})

app.delete('/api/delete-account/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await sql `SELECT user_id FROM users WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const userId = user[0].user_id;
        await sql`
            DELETE FROM users
            WHERE user_id = ${userId}`;
        res.status(200).json({message: "Account deleted"})
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})

initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
