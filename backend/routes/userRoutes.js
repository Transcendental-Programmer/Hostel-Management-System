import express from 'express';
<<<<<<< HEAD
import { registerUser, userLogin, verifyOtpAndRegister,createWorker } from '../controller/userController.js';
=======
import { registerUser, userLogin, verifyOtpAndRegister,createStaff,
    updateUserDetails, getUserDetailsById
 } from '../controller/userController.js';
>>>>>>> d9f5190202f74e21b65c61e05193f26624aa95c7

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);
userRoutes.post("/verify-otp", verifyOtpAndRegister);
<<<<<<< HEAD
userRoutes.post("/createWorker", createWorker);
=======
userRoutes.post("/createStaff", createStaff);
userRoutes.put("/updateUserDetails/:user_id", updateUserDetails);
userRoutes.get("/getUserDetailsById/:user_id", getUserDetailsById);
>>>>>>> d9f5190202f74e21b65c61e05193f26624aa95c7

export default userRoutes;
