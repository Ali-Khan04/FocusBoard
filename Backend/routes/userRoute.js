import express from "express";
import { userController } from "../controller/userAuthController.js";
import { userAuth } from "../middlewares/userAuthDataValidation.js";
import { EditProfile } from "../controller/ProfileController.js";
import { ProfileValidator } from "../middlewares/ProfileValidation.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/signup", userAuth.validateSignUp, userController.signUp);
router.post("/signin", userAuth.validateSignIn, userController.signIn);
router.patch(
  "/profile",
  verifyToken,
  ProfileValidator.UserProfileValidation,
  EditProfile.UserProfile
);
router.patch(
  "/avatar",
  verifyToken,
  ProfileValidator.AvatarValidator,
  EditProfile.AvatarUpdate
);
router.post("/logout", userController.logout);

export default router;
