import bcrypt from "bcrypt";
import User from "../models/users.js";
import { jwtGenerator, jwtDecoder } from "../utils/jwtToken.js";
import { otpGenerator, verifyOtp } from "../utils/otpUtils.js";
import { sendOtp } from "../utils/communicationUtils.js"; // Send OTP via email/SMS
import client from "../config/redisClient.js";

const emailPattern = /^[a-zA-Z0-9._%+-]+@iiitm\.ac\.in$/;
// Register User API with OTP
export const registerUser = async (req, res) => {
  const { full_name, email, username, phone_number, password, role, roll_number, hostel_number, room_number } = req.body;

  // Email validation
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff and authorities of IIITM-Gwalior are allowed");
  }


  // Role-based validation
  if (role === "student" && !roll_number) return res.status(400).json("Roll number is required for student registration");
  if (role === "warden" && !hostel_number) return res.status(400).json("Hostel number is required for warden registration");

  try {
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existingUser) return res.status(401).json("User already exists!");

    // Generate OTP and convert the otp into string
    const otp = otpGenerator().toString();

    await sendOtp(email, otp);

    // Cache OTP and user data with expiration (e.g., 5 minutes)
    const tempUserData = { full_name, email, username, phone_number, password, role, roll_number, hostel_number, room_number };
    await client.setEx(`otp:${email}`, 300, JSON.stringify({ otp, tempUserData }));

    res.json("OTP sent, please verify to complete registration");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
};

// OTP Verification API
export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp, password } = req.body;

  // Email validation
  // const emailPattern = /^[a-zA-Z0-9._%+-]+@iiitm\.ac\.in$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff and authorities of IIITM-Gwalior are allowed");
  }


  // Retrieve OTP and temp user data from cache
  const cachedData = await client.get(`otp:${email}`);
  // console.log(cachedData);

  if (!cachedData) return res.status(400).json("Invalid OTP or session expired");

  const { otp: cachedOtp, tempUserData } = JSON.parse(cachedData);
  if (cachedOtp !== otp) return res.status(400).json("Invalid OTP or session expired");

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Create user with the retrieved tempUserData
    const newUser = new User({
      ...tempUserData,
      password_hash: bcryptPassword,
    });
    await newUser.save();

    // Clean up by deleting OTP and temp data from cache after verification
    await client.del(`otp:${email}`);

    const jwtToken = jwtGenerator(newUser.user_id, newUser.role);
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

    const jwtToken = jwtGenerator(user.user_id, user.role);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};

// Worker Creation by Warden
export const createWorker = async (req, res) => {
  const { full_name, email, username, phone_number, password, hostel_number } = req.body;
  const role = "worker"; // Workers always have 'worker' role
  // Email validation
  // const emailPattern = /^[a-zA-Z0-9._%+-]+@iiitm\.ac\.in$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff and authorities of IIITM-Gwalior are allowed");
  }

  try {
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });
    if (existingUser) return res.status(401).json("Worker with this email already exists!");

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newWorker = new User({
      full_name,
      email,
      username,
      phone_number,
      password_hash: bcryptPassword,
      role,
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
