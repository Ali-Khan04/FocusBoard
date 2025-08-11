import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  title: {
    type: "string",
    unique: false,
    required: true,
  },
  description: {
    type: "sting",
    unique: false,
    required: true,
  },
  date: { type: Date, required: true },
});
const User = mongoose.Model("User", userSchema);
export default User;
