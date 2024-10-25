import express from 'express';
import { registerUser, userLogin } from '../controller/userController.js';

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", userLogin);

export default userRoutes;
