import express from "express";
import { userController } from "../controller/userAuthController.js";
import { userAuth } from "../middlewares/userAuthDataValidation.js";

const router = express.Router();

router.post("/signup", userAuth.validateSignUp, userController.signUp);
router.post("/signin", userAuth.validateSignIn, userController.signIn);

export default router;
