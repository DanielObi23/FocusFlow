import express from 'express';
import { userProfile, uploadProfileImage, updateProfile, getProfileImage, userExperience, addWorkExperience, deleteWorkExperience, updateWorkExperience, sendFeedback } from "../controllers/profileController.js"

const router = express.Router();

router.post("/userProfile", userProfile);

router.post("/userExperience", userExperience);

router.get("/profileUrl", uploadProfileImage);

router.post("/profileImage", getProfileImage);

router.patch("/updateProfile", updateProfile);

router.post("/addWorkExperience", addWorkExperience);

router.delete("/deleteWorkExperience/:id", deleteWorkExperience);

router.put("/updateWorkExperience/:id", updateWorkExperience);

router.post("/sendFeedback", sendFeedback);

export default router;