import bcrypt from "bcrypt";
import User from "../models/users.js";
import Staff from "../models/staff.js";
import Admin from "../models/admin.js";
import { jwtGenerator, jwtDecoder } from "../utils/jwtToken.js";
import { otpGenerator } from "../utils/otpUtils.js";
import { sendOtp } from "../utils/communicationUtils.js"; // Send OTP via email/SMS
import client from "../config/redisClient.js";

const emailPattern = /^[a-zA-Z0-9._%+-]+@iiitm\.ac\.in$/;
// Register User API with OTP
// Updated registerUser function
export const registerUser = async (req, res) => {
  const { full_name, email, username, phone_number, password, role, roll_number, hostel_number } = req.body;
  if(!email || !full_name || !username) {
    return res.status(400).json("Full name, email, and username are required");
  }
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
    }) || await Staff.findOne({
      $or: [
        { email },
        { username }
      ]
    }) || await Admin.findOne({
      $or: [
        { email },
        { username }
      ]
    });
    if (existingUser) return res.status(401).json("User already exists!");

    // Generate OTP and convert the otp into string
    const otp = otpGenerator().toString();
    await sendOtp(email, otp, full_name);

    // Cache OTP and user data with expiration (e.g., 5 minutes)
    const tempUserData = { full_name, email, username, phone_number, password, role, roll_number, hostel_number };
    await client.setEx(`otp:${email}`, 300, JSON.stringify({ otp, tempUserData }));

    res.json("OTP sent, please verify to complete registration");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
};

// Updated verifyOtpAndRegister function
export const verifyOtpAndRegister = async (req, res) => {
  const { email, otp, password: userPassword  } = req.body;

  // Retrieve OTP and temp user data from cache
  const cachedData = await client.get(`otp:${email}`);
  if (!cachedData) return res.status(400).json("Invalid OTP or session expired");

  const { otp: cachedOtp, tempUserData } = JSON.parse(cachedData);
  if (cachedOtp !== otp) return res.status(400).json("Invalid OTP or session expired");

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(userPassword, salt);

    // Create user in the appropriate table based on role
    let newUser;

    const { role, roll_number, hostel_number, room_number, ...commonData } = tempUserData; // Destructure tempUserData

    const baseUserData = {
      username: commonData.username,
      password_hash: bcryptPassword,
      email: commonData.email,
      full_name: commonData.full_name,
      phone_number: commonData.phone_number,
      language_preference: commonData.language_preference,
      is_active: true,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    if (role === "student") {
      newUser = new User({
        ...baseUserData,
        roll_number: roll_number, // Roll number is specific to students
        hostel_number: hostel_number,
        room_number: room_number,
        floor_number: commonData.floor_number, // Optional field for students
        available_time_slot: commonData.available_time_slot, // Optional field for students
      });
    } else if (role === "warden" || role === "admin") {
      newUser = new Admin({
        ...baseUserData,
        hostel_number: hostel_number, // Optional field for warden and admin
      });
    }

    // Save the new user
    await newUser.save();

    // Clean up by deleting OTP and temp data from cache after verification
    await client.del(`otp:${email}`);

    const jwtToken = jwtGenerator(newUser.user_id, role);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    console.error(err);
    res.status(500).json("Server error");
  }
};



// Login API (common for Students, Wardens, Workers)
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // Email validation
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff, and authorities of IIITM-Gwalior are allowed");
  }

  try {
    let user;
    let role;

    // Check if the user exists in the User, Staff, or Admin collections
    user = await User.findOne({ email });
    if (user) {
      role = "student";
    } else {
      user = await Staff.findOne({ email });
      if (user) {
        role = "staff";
      } else {
        user = await Admin.findOne({ email });
        if (user) {
          role = "admin";
        }
      }
    }

    // If no user is found in any collection, return an error
    if (!user) return res.status(401).json("Invalid Credentials");

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json("Invalid Credentials");

    // Generate the JWT token with user ID and assigned role
    const jwtToken = jwtGenerator(user.user_id, role);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};


// Staff Creation by Warden
export const createStaff = async (req, res) => {
  const { full_name, email, username, phone_number, password, department} = req.body;
  // const role = "staff"; // Staff always have 'staff' role

  // Email validation
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff, and authorities of IIITM-Gwalior are allowed");
  }

  try {
    // Check if the user already exists in any table
    const existingUser =
      await User.findOne({ $or: [{ email }, { username }] }) ||
      await Staff.findOne({ $or: [{ email }, { username }] }) ||
      await Admin.findOne({ $or: [{ email }, { username }] });

    if (existingUser) return res.status(401).json("Staff with this email or username already exists!");

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Create a new staff member in the Staff table
    const newStaff = new Staff({
      full_name,
      email,
      username,
      phone_number,
      password_hash: bcryptPassword,
      is_active: true,
      department,
      language_preference: req.body.language_preference || "English",
    });

    await newStaff.save();
    return res.status(201).json("Staff created successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};


// Get User Details by ID (for profile page)
export const getUserDetailsById = async (req, res) => {
  try {
    const { user_id } = req.params; // Assume user_id is extracted from decoded JWT token

    // Search across User, Staff, and Admin tables
    let user = await User.findOne({ user_id });
    let role = "student"; // Default role if found in User table

    if (!user) {
      user = await Staff.findOne({ user_id });
      role = "staff"; // Set role if found in Staff table
    }

    if (!user) {
      user = await Admin.findOne({ user_id });
      role = "admin"; // Set role if found in Admin table
    }

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Populate response according to role
    const userDetails = {
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      phone_number: user.phone_number,
      // role, // Set based on table found
      language_preference: user.language_preference,
    };

    // Include only relevant fields for each role
    if (role === "student") {
      userDetails.roll_number = user.roll_number;
      userDetails.hostel_number = user.hostel_number;
      userDetails.room_number = user.room_number;
      userDetails.floor_number = user.floor_number;
      userDetails.available_time_slot = user.available_time_slot;
    } else if (role === "admin") {
      userDetails.hostel_number = user.hostel_number;
    }
    else if(role === "staff"){
      userDetails.department = user.department;
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json("Server error");
  }
};


// Update User Details
// Update User Details
export const updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params; // Assume user_id is extracted from decoded JWT token
    const updateData = req.body; // Receive updated fields in the request body

    // Determine which collection the user belongs to and set the role
    let user = await User.findOne({ user_id });
    let role = "student"; // Default role if found in User table
    let model;

    if (user) {
      model = User;
    } else {
      user = await Staff.findOne({ user_id });
      if (user) {
        role = "staff";
        model = Staff;
      } else {
        user = await Admin.findOne({ user_id });
        if (user) {
          role = "admin";
          model = Admin;
        }
      }
    }

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Prevent updates to restricted fields
    if (updateData.email && updateData.email !== user.email) {
      return res.status(403).json("Email cannot be changed.");
    }
    if (updateData.roll_number && updateData.roll_number !== user.roll_number) {
      return res.status(403).json("Roll number cannot be changed.");
    }
    if (updateData.department && updateData.department !== user.department) {
      return res.status(403).json("Department cannot be changed.");
    }

    // Filter updateData to include only fields relevant to the role
    let filteredUpdateData = {
      full_name: updateData.full_name,
      username: updateData.username,
      phone_number: updateData.phone_number,
      language_preference: updateData.language_preference,
    };

    if (role === "student") {
      filteredUpdateData.hostel_number = updateData.hostel_number;
      filteredUpdateData.room_number = updateData.room_number;
      filteredUpdateData.floor_number = updateData.floor_number;
      filteredUpdateData.available_time_slot = updateData.available_time_slot;
    } else if (role === "staff") {
      filteredUpdateData.department = user.department; // Keep original department for staff
    } else if (role === "admin") {
      filteredUpdateData.hostel_number = updateData.hostel_number;
    }

    // Update the user in the appropriate collection
    const updatedUser = await model.findOneAndUpdate(
      { user_id },
      filteredUpdateData,
      { new: true }
    );

    res.status(200).json("User details updated successfully");
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json("Server error");
  }
};
