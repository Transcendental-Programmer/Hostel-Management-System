import express from 'express';
import { registerUser, userLogin, verifyOtpAndRegister,createStaff,
    updateUserDetails, getUserDetailsById, resendOtp
 } from '../controller/userController.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/verify-otp", verifyOtpAndRegister);
userRoutes.post("/createStaff", createStaff);
userRoutes.put("/updateUserDetails/:user_id", updateUserDetails);
userRoutes.get("/getUserDetailsById/:user_id", getUserDetailsById);
userRoutes.post("/resend-otp", resendOtp);

export default userRoutes;
