import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userName: {
    trim: true,
    lowerCase: true,
    type: String,
    min: [2, "User Name must be at least 2 character long  "],
    max: [10, "User Name must be at most 10 character long  "],
  },
  email: {
    type: String,
    trim: true,
    lowerCase: true,
    unique: true,
  },
  password: {
    trim: true,
    type: String,
    min: [2, "Password must be at least 6 character long  "],
    max: [10, "Password must be at at most 12 character long  "],
  },
  role: {
    type: String,
    enum: ["admin", "cook", "user"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpire: {
    type: Date,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = bcrypt.hash(this.password, process.env.SALT_ROUND);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error Saving the password");
  }
});
const User = mongoose.model("User", userSchema);
export default User;
