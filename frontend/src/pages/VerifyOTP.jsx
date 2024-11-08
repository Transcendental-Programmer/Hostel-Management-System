import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, password } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const ROLE_PATHS = {
    STAFF: "/staff-dashboard",
    STUDENT: "/student-home",
    WARDEN: "/warden-dashboard",
    ADMIN: "/warden-dashboard"
  };
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Demo functions
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 3000);
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
    }
  };

  const handleDemoVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      showNotification('success', 'Demo: OTP verified successfully!');
      setIsVerifying(false);
    }, 1500);
  };

  // verify OTP and register user
  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showNotification('error', 'Invalid OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch("https://hostelmate-backend-5zcj.onrender.com/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpValue,
          email: email,
          password: password
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.jwtToken) {
        showNotification('success', response.message);
        setIsVerifying(false);
        toast.success("User registered successfully! Please login to continue.");
        navigate("/login");
      }
    } catch (error) {
      showNotification('error', error.message);
      setIsVerifying(false);
    }
  }

  const handleDemoResend = () => {
    setIsResending(true);
    setTimeout(() => {
      showNotification('success', 'Demo: OTP resent successfully!');
      setTimer(60);
      setIsResending(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        {notification.message && (
          <div
            className={`mb-4 rounded-md p-4 ${notification.type === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
              }`}
          >
            {notification.message}
          </div>
        )}

        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to your email
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                maxLength={1}
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg focus:border-indigo-500 focus:ring-indigo-500"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <div>
            <button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otp.join('').length !== 6}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1 text-sm">
            <p className="text-gray-500">Didn&#39;t receive the code?</p>
            {timer > 0 ? (
              <p className="text-indigo-600">Resend in {timer}s</p>
            ) : (
              <button
                onClick={handleDemoResend}
                disabled={isResending}
                className="text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyOTP;