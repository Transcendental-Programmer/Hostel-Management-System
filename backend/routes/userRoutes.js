import express from 'express';
import { registerUser, userLogin, verifyOtpAndRegister,createWorker } from '../controller/userController.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/verify-otp", verifyOtpAndRegister);
userRoutes.post("/createWorker", createWorker);

export default userRoutes;
