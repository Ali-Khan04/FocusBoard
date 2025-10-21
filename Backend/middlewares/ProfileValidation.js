import mongoose from "mongoose";
import User from "../db/userSchema.js";
import { errorHandler } from "../utils/customError.js";

export const ProfileValidator = {
  UserProfileValidation: async (req, res, next) => {
    const { name, email, password } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(errorHandler(401, "Not authenticated"));
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(401, "Invalid ID format"));
    }

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();

    if (trimmedName && trimmedName.length < 2) {
      return next(errorHandler(400, "Name too short"));
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return next(errorHandler(400, "Invalid email format"));
    }

    if (password && password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    try {
      const userExists = await User.findById(userId);
      if (!userExists) {
        return next(errorHandler(401, "Not authorized"));
      }
    } catch (error) {
      return next(
        errorHandler(500, "Internal Server Error at Profile Validation")
      );
    }
    req.trimmedName = trimmedName || undefined;
    req.trimmedEmail = trimmedEmail || undefined;
    req.userId = userId;

    next();
  },
  AvatarValidator: (req, res, next) => {
    const userId = req.user?.id;
    const { avatar } = req.body;

    if (!userId) {
      return next(errorHandler(401, "Not authenticated"));
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Invalid user ID"));
    }

    if (!avatar) {
      return next(errorHandler(400, "No avatar provided"));
    }

    if (!avatar.startsWith("data:image/")) {
      return next(errorHandler(400, "Invalid image format"));
    }

    const base64Length =
      avatar.length * (3 / 4) - (avatar.endsWith("==") ? 2 : 0);
    if (base64Length > 5 * 1024 * 1024) {
      return next(errorHandler(400, "Avatar exceeds 5MB limit"));
    }

    req.userId = userId;
    req.avatar = avatar;
    next();
  },
};
