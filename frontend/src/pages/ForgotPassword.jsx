import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Request Reset, Step 2: OTP Verification, Step 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Handle sending reset request and OTP
  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hostelmate-backend-5zcj.onrender.com/users/forgot-password",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent to your email.");
        setStep(2); // Move to OTP verification step
      } else {
        toast.error("Email not found. Please try again.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hostelmate-backend-5zcj.onrender.com/users/verify-password-reset-otp",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP verified. You can now set a new password.");
        setStep(3); // Move to reset password step
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hostelmate-backend-5zcj.onrender.com/users/reset-password",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Password successfully reset! You can now log in.");
        // setStep(1); // Return to initial step after reset
        navigate("/login"); // Redirect to login page
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] w-full items-center justify-center text-gray-600 bg-gray-50"style={{
      background: "linear-gradient(180deg, rgba(0, 168, 255, 1) 0%, rgba(108, 73, 205, 1) 68%)",
    }}>
      <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-indigo-200 shadow-lg px-4">
        <div className="flex-auto p-6">
          {step === 1 && (
            <>
              <h4 className="mb-4 text-xl lg:text-3xl md:text-2xl text-indigo-500 font-extrabold">
                Forgot Password?
              </h4>
              <p className="mb-6 text-gray-500 lg:text-lg">
                Enter your email to receive an OTP.
              </p>
              <form onSubmit={handleRequestReset}>
                <label
                  htmlFor="email"
                  className="text-xs lg:text-base md:text-sm font-medium text-gray-700 "
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="block w-full rounded-md border border-gray-400 py-2 px-3 text-xs lg:text-base md:text-sm focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full mt-4 rounded-md bg-indigo-500 py-2 px-5 text-xs lg:text-base md:text-sm text-white shadow hover:bg-indigo-600 focus:bg-indigo-600"
                >
                  Send OTP
                </button>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h4 className="mb-4 font-medium text-gray-700 xl:text-xl">
                Verify OTP
              </h4>
              <p className="mb-6 text-gray-500">
                Enter the OTP sent to your email.
              </p>
              <form onSubmit={handleVerifyOtp}>
                <label
                  htmlFor="otp"
                  className="text-xs font-medium uppercase text-gray-700"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="block w-full rounded-md border-gray-400 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full mt-4 rounded-md bg-indigo-500 py-2 px-5 text-sm text-white shadow hover:bg-indigo-600 focus:bg-indigo-600"
                >
                  Verify OTP
                </button>
              </form>
            </>
          )}
          {step === 3 && (
            <>
              <h4 className="mb-4 font-medium text-gray-700 xl:text-xl">
                Reset Password
              </h4>
              <p className="mb-6 text-gray-500">Enter your new password.</p>
              <form onSubmit={handleResetPassword}>
                <label
                  htmlFor="newPassword"
                  className="text-xs font-medium uppercase text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="block w-full rounded-md border-gray-400 py-2 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:text-gray-600 focus:shadow"
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full mt-4 rounded-md bg-indigo-500 py-2 px-5 text-sm text-white shadow hover:bg-indigo-600 focus:bg-indigo-600"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
