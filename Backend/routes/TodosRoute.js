import { getTodos } from "../controller/getTodos.js";
import { postTodos } from "../controller/postTodos.js";
import { verifyToken } from "../utils/verifyToken.js";
import { updateTodoPriority } from "../controller/postTodos.js";
import { editTodo } from "../controller/todoEditController.js";
import express from "express";

const router = express.Router();

router.get("/getTodos", verifyToken, getTodos);
router.post("/saveTodos", verifyToken, postTodos);
router.patch("/updatePriority/:todoId", verifyToken, updateTodoPriority);
router.patch("/updateTodo/:todoId", verifyToken, editTodo.updateTodo);
router.patch("/markDone/:todoId", verifyToken, editTodo.markAsDone);
router.delete("/deleteTodo/:todoId", verifyToken, editTodo.deleteTodo);
export default router;
