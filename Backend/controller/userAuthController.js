import User from "../db/userSchema.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/customError.js";
import jwt from "jsonwebtoken";

export const userController = {
  signUp: async (req, res, next) => {
    const { name, email, hashedPassword } = req;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return next(errorHandler(400, "User already registered"));

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          avatar: savedUser.avatar || "",
        },
      });
    } catch (err) {
      console.error("Error in signUp:", err);
      next(errorHandler(500, "Error registering user"));
    }
  },

  signIn: async (req, res, next) => {
    const { email, password } = req;

    try {
      const user = await User.findOne({ email });
      if (!user) return next(errorHandler(404, "User not found"));

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return next(errorHandler(401, "Invalid email or password"));

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(200).json({
        message: "Login successful",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
        },
      });
    } catch (err) {
      console.error("Error in signIn:", err);
      next(errorHandler(500, "Internal server error while signing in"));
    }
  },

  logout: async (req, res, next) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error("Error in logout:", err);
      next(errorHandler(500, "Error logging out"));
    }
  },
};
