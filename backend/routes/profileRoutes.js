import express from 'express';
import { userData, uploadProfileImage, updateProfile, getProfileImage } from "../controllers/profileController.js"

const router = express.Router();

router.post("/userData", userData);

router.get("/profileUrl", uploadProfileImage);

router.post("/profileImage", getProfileImage);

router.patch("/updateProfile", updateProfile);

export default router;