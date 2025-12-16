import express from "express";
import { login, signup, verifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
