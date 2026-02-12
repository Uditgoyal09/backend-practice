import express from "express";
import {signUp, login, sendOtp, verifyOtp} from "../controllers/auth.controller.js"
const router= express.Router();

router.post("/send-otp",sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup",signUp);
router.post("/login",login);


export default router;