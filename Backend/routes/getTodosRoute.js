import { getTodos } from "../controller/getTodos.js";
import express from "express";

const router = express.Router();

router.get("/getTodos", getTodos);
export default router;
