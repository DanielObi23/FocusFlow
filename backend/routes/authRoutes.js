import express from "express";
import {login, register, logout, refreshToken, forgotPassword, resetPassword, validateToken, verifyEmail, verifyOTP} from "../controllers/authController.js"
import authenticateToken from "../middleware/authorization.js";

const router = express.Router();

router.post("/login", login)

router.post("/register", register)

router.post("/verify-email", verifyEmail)

router.post("/verify-otp", verifyOTP)

router.post("/logout", logout)

router.post("/token", refreshToken);

router.post("/forgotPassword", forgotPassword);

router.patch("/resetPassword/:token", resetPassword);

router.get("/validate-token", authenticateToken, validateToken);

export default router;