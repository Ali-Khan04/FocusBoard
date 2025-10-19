export const formatTodos = (todos) =>
  todos.map((todo) => ({
    id: todo._id,
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    completed: todo.completed,
    dueDate: todo.dueDate
      ? todo.dueDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null,
    createdAt: todo.createdAt.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAt: todo.updatedAt.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
