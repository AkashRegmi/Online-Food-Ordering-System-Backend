import z, { email } from "zod";
export const registerUserSchema = z.object({
  userName: z
    .string("userName is required")
    .min(2, "userName must be at least 2 character long ")
    .max(10, "User Name must be at most 10 character long ")
    .regex(/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/, "Please provide the valid userName"),
  email: z
    .email("please provide the valid email")
    .includes(
      "@",
      "Please peovide the valid email in the format of the ...@...",
    ),
  password: z
    .string("Please provide the valid password")
    .min(6, "password must be at least 6 character ")
    .max(12, "password must be he at most 12 character long ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export const otpVerifyRegistration = z.object({
  email: z.string("please provide the email").email("Provide the vald email"),
  otp: z
    .string("please Provide the OTP")
    .min(5, "Please provide the valid OTP")
    .max(5, "Please provide the valid OTP"),
});

export const loginUserSchema = z.object({
  email: z
    .email("please provide the valid email")
    .includes(
      "@",
      "Please peovide the valid email in the format of the ...@...",
    ),
  password: z
    .string("Please provide the valid password")
    .min(6, "password must be at least 6 character ")
    .max(12, "password must be he at most 12 character long "),
});

export const resetPasswordSchema = z.object({
  password: z.string("Please Provide the Password").trim(),
  newPassword: z
    .string("Please provide the new Password")
    .min(6, "New password must be at least 6 character ")
    .max(12, "New password must be he at most 12 character long ")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .trim(),
});
