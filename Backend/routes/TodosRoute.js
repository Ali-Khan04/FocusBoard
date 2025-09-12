import { getTodos } from "../controller/getTodos.js";
import { postTodos } from "../controller/postTodos.js";
import { verifyToken } from "../utils/verifyToken.js";
import { updateTodoPriority } from "../controller/postTodos.js";
import express from "express";

const router = express.Router();

router.get("/getTodos", verifyToken, getTodos);
router.post("/saveTodos", verifyToken, postTodos);
router.patch("/updatePriority/:todoId", verifyToken, updateTodoPriority);
export default router;
