import express from 'express';
import { userProfile, uploadProfileImage, updateProfile, getProfileImage } from "../controllers/profileController.js"

const router = express.Router();

router.get("/userProfile/:email", userProfile);

router.get("/profileUrl", uploadProfileImage);

router.get("/profileImage/:email", getProfileImage);

router.patch("/updateProfile", updateProfile);

export default router;