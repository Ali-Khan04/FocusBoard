import User from "../db/userSchema.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userDetails = new User({ name, email, password: hashedPassword });
  try {
    await userDetails.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
