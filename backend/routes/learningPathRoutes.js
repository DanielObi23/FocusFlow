import express from 'express';
import { createPath, getPaths } from "../controllers/learningPathController.js"

const router = express.Router();

router.post("/createPath", createPath);

router.get("/getPaths/:email", getPaths);

export default router;