import bcrypt from "bcrypt";
import users from "../models/users.js";
import { jwtGenerator, jwtDecoder } from "../utils/jwtToken.js";
import { otpGenerator, verifyOtp } from "../utils/otpUtils.js";
import { sendOtp } from "../utils/communicationUtils.js"; // Send OTP via email/SMS

// Register User API with OTP
export const registerUser = async (req, res) => {
  const { full_name, email, phone_number, password, role_id, roll_number, hostel_number, room_number } = req.body;

  // Role-based validation
  if (role_id === "student" && !roll_number) return res.status(400).json("Roll number is required for student registration");
  if (role_id === "warden" && !hostel_number) return res.status(400).json("Hostel number is required for warden registration");

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).json("User already exists!");

    // Generate OTP
    const otp = otpGenerator();
    await sendOtp(email, otp);

    // Temporarily store data in session or cache with OTP for verification
    req.session.tempUserData = { full_name, email, phone_number, password, role_id, roll_number, hostel_number, room_number, otp };

    res.json("OTP sent, please verify to complete registration");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};

// OTP Verification API
export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp, password } = req.body;
  const tempUserData = req.session.tempUserData;

  if (!tempUserData || tempUserData.email !== email || tempUserData.otp !== otp) return res.status(400).json("Invalid OTP or session expired");

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      ...tempUserData,
      password_hash: bcryptPassword
    });
    await newUser.save();

    const jwtToken = jwtGenerator(newUser.user_id, newUser.role_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};

// Login API (common for Students, Wardens, Workers)
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json("Invalid Credentials");

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json("Invalid Credentials");

    const jwtToken = jwtGenerator(user.user_id, user.role_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};

// Worker Creation by Warden
export const createWorker = async (req, res) => {
  const { full_name, email, phone_number, password, hostel_number } = req.body;
  const role_id = "worker"; // Workers always have 'worker' role

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).json("Worker with this email already exists!");

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newWorker = new User({
      full_name,
      email,
      phone_number,
      password_hash: bcryptPassword,
      role_id,
      hostel_number,
      is_active: true
    });

    await newWorker.save();
    return res.status(201).json("Worker created successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};
