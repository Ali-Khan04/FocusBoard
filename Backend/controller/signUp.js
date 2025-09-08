import User from "../db/userSchema.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/customError.js";
import validator from "validator";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(errorHandler(500, "Required Fields Missing"));
  if (!validator.isEmail(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }
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
