import nodemailer from "nodemailer";

// Sends OTP email for signing up to the Hostel Management System
export const sendOtp = async (email, otp, name) => {
  console.log(`Sending OTP ${otp} to email: ${email} from ${process.env.EMAIL}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.MAILPASS, // Your app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // Sender email
    to: email, // Receiver's email
    subject: "Your OTP for Hostel Management System Sign Up",
    text: `Hi ${name},\n\nYour OTP for signing up to the Hostel Management System is: ${otp}.\n\nPlease note that this OTP is valid for 5 minutes. Do not share this code with anyone to ensure the security of your account.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
};

// Sends OTP email for resetting the password in the Hostel Management System
export const sendResetOtp = async (email, otp, name) => {
  console.log(`Sending OTP ${otp} to email: ${email} from ${process.env.EMAIL}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.MAILPASS, // Your app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, // Sender email
    to: email, // Receiver's email
    subject: "Your OTP for Hostel Management System Password Reset",
    text: `Hi ${name},\n\nYour OTP for resetting your password in the Hostel Management System is: ${otp}.\n\nPlease note that this OTP is valid for 5 minutes. Do not share this code with anyone to ensure the security of your account.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset OTP email sent successfully!");
  } catch (error) {
    console.error("Failed to send password reset OTP email:", error);
  }
};
