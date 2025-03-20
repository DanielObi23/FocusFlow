import express from "express";
import {login, register, logout, refreshToken, forgotPassword, resetPassword} from "../controllers/authController.js"

const router = express.Router();

router.post("/login", login)

router.post("/register", register)

router.post("/logout", logout)

router.post("/token", refreshToken);

router.post("/forgotPassword", forgotPassword);

router.patch("/resetPassword/:token", resetPassword);

export default router;