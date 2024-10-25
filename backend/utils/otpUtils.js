export const otpGenerator = () => Math.floor(100000 + Math.random() * 900000);


export const verifyOtp = (email, otp) => {
    console.log(`Verifying OTP ${otp} to email: ${email}`);
};
