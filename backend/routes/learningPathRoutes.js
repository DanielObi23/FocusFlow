import express from 'express';
import { createPath } from "../controllers/learningPathController.js"

const router = express.Router();

router.post("/createPath", createPath);

export default router;