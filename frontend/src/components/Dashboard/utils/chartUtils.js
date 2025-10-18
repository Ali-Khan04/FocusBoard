export const getPendingTodos = (todos) => todos.filter((t) => !t.completed);

export const getOverdueTodos = (todos) => {
  const now = new Date();
  return todos
    .filter((t) => t.dueDate && !t.completed && new Date(t.dueDate) < now)
    .slice(0, 5);
};

export const getNext7DaysData = (todos) => {
  const pending = getPendingTodos(todos);
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const dayData = { name: label, High: 0, Medium: 0, Low: 0 };
    pending.forEach((t) => {
      if (!t.dueDate) return;
      const todoDate = new Date(t.dueDate);
      if (todoDate.toDateString() === date.toDateString()) {
        dayData[t.priority]++;
      }
    });
    result.push(dayData);
  }
  return result;
};

export const getPriorityDistribution = (todos) => {
  const pending = getPendingTodos(todos);
  const dist = { High: 0, Medium: 0, Low: 0 };
  pending.forEach((t) => dist[t.priority]++);
  return [
    { name: "High", value: dist.High, color: "#ff5252" },
    { name: "Medium", value: dist.Medium, color: "#ffa726" },
    { name: "Low", value: dist.Low, color: "#66bb6a" },
  ];
};
