import User from "../db/userSchema.js";
import { errorHandler } from "../utils/customError.js";
import bcrypt from "bcrypt";

export const EditProfile = {
  UserProfile: async (req, res, next) => {
    const { trimmedName, trimmedEmail, userId } = req;
    const { password } = req.body;

    try {
      const updateData = { name: trimmedName, email: trimmedEmail };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      const updateProfile = await User.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      );

      if (!updateProfile) {
        return next(errorHandler(404, "User not found"));
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updateProfile,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(errorHandler(400, "Email already in use"));
      }
      console.error("Profile Update Error:", error);
      next(errorHandler(500, "Internal Server Error while updating profile"));
    }
  },
  AvatarUpdate: async (req, res, next) => {
    const { userId, avatar } = req;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true }
      );

      if (!updatedUser) {
        return next(errorHandler(404, "User not found"));
      }

      res.status(200).json({
        message: "Avatar uploaded successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Avatar Upload Error:", error);
      next(errorHandler(500, "Internal Server Error while uploading avatar"));
    }
  },
};
