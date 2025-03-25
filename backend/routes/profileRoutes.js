import express from 'express';
import { userData, uploadProfileImage, updateProfile, getProfileImage, addWorkExperience, deleteWorkExperience, updateWorkExperience } from "../controllers/profileController.js"

const router = express.Router();

router.post("/userData", userData);

router.get("/profileUrl", uploadProfileImage);

router.post("/profileImage", getProfileImage);

router.patch("/updateProfile", updateProfile);

router.post("/addWorkExperience", addWorkExperience);

router.delete("/deleteWorkExperience/:id", deleteWorkExperience);

router.put("/updateWorkExperience/:id", updateWorkExperience);

export default router;