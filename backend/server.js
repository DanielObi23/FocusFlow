import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import initDB from "./config/dbInit.js";
import { aj, ajStrict } from "./lib/arcjet.js"
import learningPathRoutes from "./routes/learningPathRoutes.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

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
app.use("/api/profile/skills", skillRoutes)

initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
