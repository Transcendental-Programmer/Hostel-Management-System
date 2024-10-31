import { sendOtp, sendResetOtp, sendGrievanceFiledNotification, sendStaffAssignedNotification, sendMissedAppointmentNotification, sendGrievanceResolvedNotification, sendFeedbackReminderNotification } from './utils/communicationUtils.js';

// Function to test all email notifications with dummy data
const testEmailFunctions = async () => {
  const dummyEmail = "imt_2022103@iiitm.ac.in";
  const dummyOtp = "123456";
  const dummyName = "John Doe";
  const dummyGrievanceId = "GRV12345";
  const dummyStaffName = "Jane Smith";
  const dummyScheduledTime = "2024-11-01 10:00 AM";

  try {
    console.log("Testing OTP email...");
    await sendOtp(dummyEmail, dummyOtp, dummyName);

    console.log("Testing password reset OTP email...");
    await sendResetOtp(dummyEmail, dummyOtp, dummyName);

    console.log("Testing grievance filed notification...");
    await sendGrievanceFiledNotification(dummyEmail, dummyGrievanceId, dummyName);

    console.log("Testing staff assigned notification...");
    await sendStaffAssignedNotification(dummyEmail, dummyStaffName, dummyGrievanceId, dummyName);

    console.log("Testing missed appointment notification...");
    await sendMissedAppointmentNotification(dummyEmail, dummyScheduledTime, dummyName);

    console.log("Testing grievance resolved notification...");
    await sendGrievanceResolvedNotification(dummyEmail, dummyGrievanceId, dummyName);

    console.log("Testing feedback reminder notification...");
    await sendFeedbackReminderNotification(dummyEmail, dummyGrievanceId, dummyName);

    console.log("All email tests completed!");
  } catch (error) {
    console.error("Error testing email functions:", error);
  }
};

// Call the test function
testEmailFunctions();
