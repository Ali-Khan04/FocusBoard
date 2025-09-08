import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [30, "Name exceeds its limit"],
    minlength: [3, "Name should atleast be 3 characters long"],
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);
export default User;
