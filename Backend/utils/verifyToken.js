import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(401, "Access denied. No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, "Invalid or expired token"));
    req.user = decoded;
    next();
  });
};
