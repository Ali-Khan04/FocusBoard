import User from "../db/userSchema.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/customError.js";
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(errorHandler(500, "Required Fields Missing"));
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userDetails = new User({ name, email, password: hashedPassword });
  try {
    const savedUser = await userDetails.save();
    res.status(201).json({
      message: "User registered successfully",
      id: savedUser._id,
      name: savedUser.email,
    });
  } catch (err) {
    next(err);
  }
};
