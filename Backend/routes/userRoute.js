import { signUp } from "../controller/signUp.js";
import { signIn } from "../controller/signIn.js";
import express from "express";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
export default router;
