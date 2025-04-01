import express from 'express';
import { userExperience, addWorkExperience, deleteWorkExperience, updateWorkExperience } from "../controllers/experienceController.js"

const router = express.Router();

router.get("/userExperience/:email", userExperience);

router.post("/addWorkExperience", addWorkExperience);

router.delete("/deleteWorkExperience/:id", deleteWorkExperience);

router.put("/updateWorkExperience/:id", updateWorkExperience);

export default router;