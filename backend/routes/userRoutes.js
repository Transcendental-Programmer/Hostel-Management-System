import express from 'express';
import { registerUser, userLogin, verifyOtpAndRegister,createStaff,
    updateUserDetails, getUserDetailsById, resendOtp, forgotPassword, resendPasswordResetOtp, verifyOtp, updatePassword,verifyOldPassword, resetPassword,updateStaffStatus
 } from '../controller/userController.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/verify-otp", verifyOtpAndRegister);
userRoutes.post("/createStaff", createStaff);
userRoutes.put("/updateUserDetails/:user_id", updateUserDetails);
userRoutes.put("/updateStaffStatus/:user_id", updateStaffStatus);
userRoutes.get("/getUserDetailsById/:user_id", getUserDetailsById);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.post("/forgot-password",forgotPassword);
userRoutes.post("/resend-password-reset-otp", resendPasswordResetOtp);
userRoutes.post("/verify-password-reset-otp", verifyOtp);
userRoutes.post("/update-password", updatePassword);
userRoutes.post("/verify-old-password", verifyOldPassword);
userRoutes.post("/reset-password", resetPassword);

export default userRoutes;
