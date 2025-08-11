import { getTodos } from "../controller/getTodos.js";
import { postTodos } from "../controller/postTodos.js";
import express from "express";

const router = express.Router();

router.get("/getTodos", getTodos);
router.post("/saveTodos", postTodos);
export default router;
