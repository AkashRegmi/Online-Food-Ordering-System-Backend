export const generateOtp = (length) => {
  const digit = "1234567890";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digit[Math.floor(Math.random() * 10)];
  }

  return otp;
};