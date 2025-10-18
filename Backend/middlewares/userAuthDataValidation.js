import validator from "validator";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/customError.js";

export const userAuth = {
  validateSignUp: (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return next(errorHandler(400, "All fields are required"));

    if (!validator.isEmail(email))
      return next(errorHandler(400, "Invalid email format"));

    if (password.length < 6)
      return next(errorHandler(400, "Password must be at least 6 characters"));

    const hashedPassword = bcrypt.hashSync(password, 10);

    req.name = name.trim();
    req.email = email.trim().toLowerCase();
    req.hashedPassword = hashedPassword;

    next();
  },

  validateSignIn: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(errorHandler(400, "Email and password are required"));

    if (!validator.isEmail(email))
      return next(errorHandler(400, "Invalid email format"));

    req.email = email.trim().toLowerCase();
    req.password = password;

    next();
  },
};
