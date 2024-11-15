import bcrypt from "bcrypt";
import Student from "../models/student.js";
import Staff from "../models/staff.js";
import Admin from "../models/admin.js";
import { jwtGenerator, jwtDecoder } from "../utils/jwtToken.js";
import { otpGenerator } from "../utils/otpUtils.js";
import { sendOtp,sendResetOtp } from "../utils/communicationUtils.js"; // Send OTP via email/SMS
import client from "../config/redisClient.js";

const emailPattern = /^[a-zA-Z0-9._%+-]+@iiitm\.ac\.in$/;
// Register User API with OTP
// Updated registerUser function
export const registerUser = async (req, res) => {
  const { full_name, email, username, phone_number, password, role, roll_number, hostel_number,room_number } = req.body;
  console.log(req.body);
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
    const existingUser = await Student.findOne({
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
    const tempUserData = { full_name, email, username, phone_number, password, role, roll_number, hostel_number,room_number};
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
  console.log(cachedData);
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
      newUser = new Student({
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

    if (!newUser) {
      return res.status(400).json("Invalid user role");
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


// Resend OTP API
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only the verified students, staff and authorities of IIITM-Gwalior are allowed");
  }

  try {
    // Retrieve cached data if exists
    const cachedData = await client.get(`otp:${email}`);
    if (!cachedData) return res.status(400).json("No pending OTP request for this email");

    // Parse cached user data
    const { tempUserData } = JSON.parse(cachedData);

    // Generate and send new OTP
    const newOtp = otpGenerator().toString();
    await sendOtp(email, newOtp, tempUserData.full_name);

    // Update OTP in cache with expiration (e.g., 5 minutes)
    await client.setEx(`otp:${email}`, 300, JSON.stringify({ otp: newOtp, tempUserData }));

    res.json("OTP resent, please check your email").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// Login API (common for Students, Wardens, Workers)
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    let role;

    // Check if the user exists in the User, Staff, or Admin collections
    user = await Student.findOne({ email });
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
    return res.json({ 
      jwtToken,
      user:user,
      role:role
     })
     .status(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
};


// Staff Creation by Warden
export const createStaff = async (req, res) => {
  const { full_name, email, username, phone_number, password, department} = req.body;
  // const role = "staff"; // Staff always have 'staff' role

  try {
    // Check if the user already exists in any table
    const existingUser =
      await Student.findOne({ $or: [{ email }, { username }] }) ||
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

// Forgot Password API

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists in Student, Staff, or Admin collections
    let user = await Student.findOne({ email }) || await Staff.findOne({ email }) || await Admin.findOne({ email });
    if (!user) return res.status(404).json("User with this email not found");

    // Generate and send OTP
    const otp = otpGenerator().toString();
    await sendResetOtp(email, otp, user.full_name);

    // Cache OTP with expiration
    await client.setEx(`forgot-password:${email}`, 300, otp);

    res.json("OTP sent for password reset").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// Resend OTP for Password Reset API
export const resendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!emailPattern.test(email)) {
    return res.status(400).json("Only verified students, staff, and authorities of IIITM-Gwalior are allowed");
  }

  try {
    // Retrieve cached OTP data if exists
    const cachedOtp = await client.get(`forgot-password:${email}`);
    if (!cachedOtp) return res.status(400).json("No pending password reset OTP request for this email");

    // Generate and send new OTP
    const newOtp = otpGenerator().toString();
    const user = await Student.findOne({ email }) || await Staff.findOne({ email }) || await Admin.findOne({ email });
    if (!user) return res.status(404).json("User with this email not found");

    await sendResetOtp(email, newOtp, user.full_name);

    // Update OTP in cache with expiration (e.g., 5 minutes)
    await client.setEx(`forgot-password:${email}`, 300, newOtp);

    res.json("Password reset OTP resent, please check your email").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};


// Verify OTP for Forgot Password API
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const cachedOtp = await client.get(`forgot-password:${email}`);
    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(200).json("Invalid OTP or session expired");
    }

    // OTP is valid
    res.json("OTP verified, proceed to reset password").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};


// Update Password after Forgot Password API
export const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the respective collection
    let user = await Student.findOneAndUpdate({ email }, { password_hash: hashedPassword }) ||
               await Staff.findOneAndUpdate({ email }, { password_hash: hashedPassword }) ||
               await Admin.findOneAndUpdate({ email }, { password_hash: hashedPassword });
    
    if (!user) return res.status(404).json("User not found");

    // Remove OTP from cache after password reset
    await client.del(`forgot-password:${email}`);

    res.json("Password updated successfully").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};


// Update Password APIs

// Verify Old Password API
export const verifyOldPassword = async (req, res) => {
  const { email, oldPassword } = req.body;

  try {
    let user =
      await Student.findOne({ email }) ||
      await Staff.findOne({ email }) ||
      await Admin.findOne({ email });

    if (!user) return res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) return res.status(401).json("Incorrect old password");

    res.json("Old password verified").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

// Reset Password API
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user =
      await Student.findOneAndUpdate({ email }, { password_hash: hashedPassword }) ||
      await Staff.findOneAndUpdate({ email }, { password_hash: hashedPassword }) ||
      await Admin.findOneAndUpdate({ email }, { password_hash: hashedPassword });

    if (!user) return res.status(404).json("User not found");

    res.json("Password reset successfully").status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};




//profile apis (might shift them in a new file)


// Get User Details by ID (for profile page)
export const getUserDetailsById = async (req, res) => {
  try {
    const { user_id } = req.params; // Assume user_id is extracted from decoded JWT token

    // Search across User, Staff, and Admin tables
    let user = await Student.findOne({ user_id:user_id });
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
      role, // Set based on table found
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
    // console.log(req.params);
    
    // console.log(updateData);
    // Determine which collection the user belongs to and set the role
    let user = await Student.findOne({ user_id });
    let role = "student"; // Default role if found in User table
    let model;

    if (user) {
      model = Student;
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
      filteredUpdateData.is_active = user.is_active; // Keep original department for staff
    } else if (role === "admin") {
      filteredUpdateData.hostel_number = updateData.hostel_number;
    }
    // console.log("Filtered Data:", filteredUpdateData);
    // console.log("Model:", model);
    
    
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

// update staff status
export const updateStaffStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { is_active } = req.body;

    if (!req.method === 'PUT') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    console.log(user_id);
    console.log(is_active);
    
    
    const staff = await Staff.findOneAndUpdate(
      { user_id: user_id },
      { is_active, updated_at: Date.now() },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff status updated successfully' });
  } catch (err) {
    console.error('Error updating staff status:', err);
    res.status(500).json({ message: 'Error updating staff status' });
  }
};