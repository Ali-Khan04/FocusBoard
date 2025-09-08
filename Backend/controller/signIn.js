import User from "../db/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/customError.js";
import validator from "validator";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(errorHandler(500, "Required Fields Missing"));
  try {
    if (typeof email !== "string")
      return next(errorHandler(400, "Invalid email"));
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid email format"));
    }
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: false,
        sameSite: "lax",
      })
      .status(201)
      .json({
        user: {
          _id: validUser._id,
          name: validUser.name,
          email: validUser.email,
        },
      });
  } catch (err) {
    next(errorHandler(500, "Error during Sign in"));
  }
};
