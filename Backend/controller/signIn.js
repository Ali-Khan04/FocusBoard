import User from "../db/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/customError.js";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: hashedPassword, ...rest } = validUser._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, user: rest });
  } catch (err) {
    next(errorHandler(500, "Error during Sign in"));
  }
};
