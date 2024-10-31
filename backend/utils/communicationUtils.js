import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.MAILPASS, // Your app-specific password
  },
});
// Sends OTP email for signing up to the Hostel Management System
export const sendOtp = async (email, otp, name) => {
  console.log(`Sending OTP ${otp} to email: ${email} from ${process.env.EMAIL}`);


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



// notifications regarding the grievance status and updates to the user

// Sends notification when a new grievance has been filed
export const sendGrievanceFiledNotification = async (email, grievanceId, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Grievance Submission Confirmation",
    text: `Dear ${name},\n\nWe have successfully received your grievance (Ticket ID: ${grievanceId}). A staff member will be assigned shortly to address your issue.\n\nThank you for your patience.\n\nBest regards,\nHostel Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Grievance filed notification email sent successfully!");
  } catch (error) {
    console.error("Failed to send grievance filed notification email:", error);
  }
};

// Sends notification when a staff member has been assigned to a grievance
export const sendStaffAssignedNotification = async (email, staffName, grievanceId, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Staff Assigned to Your Grievance",
    text: `Dear ${name},\n\nWe would like to inform you that ${staffName} has been assigned to handle your grievance (Ticket ID: ${grievanceId}). They will reach out to you soon to initiate the resolution process.\n\nThank you for your cooperation.\n\nBest regards,\nHostel Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Staff assigned notification email sent successfully!");
  } catch (error) {
    console.error("Failed to send staff assigned notification email:", error);
  }
};

// Sends notification for a missed grievance resolution appointment
export const sendMissedAppointmentNotification = async (email, scheduledTime, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Missed Grievance Resolution Appointment",
    text: `Dear ${name},\n\nWe regret to inform you that you were not present for your scheduled grievance resolution appointment on ${scheduledTime}. Please contact us at your earliest convenience to reschedule.\n\nThank you for your attention.\n\nBest regards,\nHostel Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Missed appointment notification email sent successfully!");
  } catch (error) {
    console.error("Failed to send missed appointment notification email:", error);
  }
};

// Sends notification when a grievance has been resolved
export const sendGrievanceResolvedNotification = async (email, grievanceId, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Grievance Resolution Completed",
    text: `Dear ${name},\n\nWe are pleased to inform you that your grievance (Ticket ID: ${grievanceId}) has been resolved. Kindly review the resolution and provide any feedback to help us improve our services.\n\nThank you for your trust in our system.\n\nBest regards,\nHostel Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Grievance resolved notification email sent successfully!");
  } catch (error) {
    console.error("Failed to send grievance resolved notification email:", error);
  }
};

// Additional: Sends notification if grievance review/feedback is overdue
export const sendFeedbackReminderNotification = async (email, grievanceId, name) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reminder: Provide Feedback on Resolved Grievance",
    text: `Dear ${name},\n\nThis is a friendly reminder to review and provide feedback on your recently resolved grievance (Ticket ID: ${grievanceId}). Your feedback is valuable and helps us improve our services.\n\nThank you for your time.\n\nBest regards,\nHostel Management Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Feedback reminder email sent successfully!");
  } catch (error) {
    console.error("Failed to send feedback reminder email:", error);
  }
};
