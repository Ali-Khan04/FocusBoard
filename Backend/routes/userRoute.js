import { signUp } from "../controller/signUp.js";
import express from "express";

const router = express.Router();

router.post("/signUp", signUp);
export default router;
