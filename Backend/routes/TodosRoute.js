import { verifyToken } from "../utils/verifyToken.js";
import { editTodo } from "../controller/todoEditController.js";
import { todoDataValidator } from "../middlewares/todoDataValidation.js";
import { todoPrimaryController } from "../controller/todoPrimaryController.js";
import express from "express";

const router = express.Router();

router.get(
  "/getTodos",
  verifyToken,
  todoDataValidator.validateGetUser,
  todoPrimaryController.getTodos
);
router.post(
  "/saveTodos",
  verifyToken,
  todoDataValidator.validatePostUser,
  todoPrimaryController.postTodos
);
router.patch(
  "/updatePriority/:todoId",
  verifyToken,
  todoDataValidator.validatepriority,
  editTodo.updateTodoPriority
);
router.patch(
  "/updateTodo/:todoId",
  verifyToken,
  todoDataValidator.validateUpdateTodo,
  editTodo.updateTodo
);
router.patch(
  "/markDone/:todoId",
  verifyToken,
  todoDataValidator.validateMarkTodo,
  editTodo.markAsDone
);
router.delete(
  "/deleteTodo/:todoId",
  verifyToken,
  todoDataValidator.validateDeleteTodo,
  editTodo.deleteTodo
);
export default router;
