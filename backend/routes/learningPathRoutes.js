import express from 'express';
import { createPath, getPaths, deletePath, completePath } from "../controllers/learningPathController.js"

const router = express.Router();

router.post("/createPath", createPath);

router.get("/getPaths/:email", getPaths);

router.delete("/deletePath/:id", deletePath);

router.post("/completePath/:id", completePath);

export default router;