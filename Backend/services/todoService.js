import Todo from "../db/TodoSchema.js";

const priorityOrder = { High: 1, Medium: 2, Low: 3 };

export const fetchTodos = async (userId, page = 0, limit = 10) => {
  const todos = await Todo.find({ user: userId, completed: false })
    .sort({ priority: 1, createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  const sortedTodos = todos.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return b.createdAt - a.createdAt;
  });

  const totalTodos = await Todo.countDocuments({ user: userId });
  return { sortedTodos, totalTodos };
};
