import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  nId: String,
  picture: String,
  address: {
    city: String,
    street: String,
  },
  phone: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  codeExpiryDate: Date,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("user", userSchema);
export default User;
