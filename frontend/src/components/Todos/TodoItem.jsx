import PrioritySelector from "./PrioritySelector.jsx";
import TodoActions from "./TodoActions.jsx";
import "../../CSS/renderTodo.css";

export default function TodoItem({
  item,
  dispatch,
  fetchTodos,
  state,
  setEditingTodo,
  isCompleted = false,
}) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff5252";
      case "Medium":
        return "#ff9800";
      case "Low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  return (
    <div
      className="todo-container"
      style={{
        borderLeft: `4px solid ${getPriorityColor(item.priority)}`,
      }}
    >
      <div className="todo-header">
        <h1>{item.title}</h1>
        <span
          className="priority-badge"
          style={{
            backgroundColor: getPriorityColor(item.priority),
            color: "white",
          }}
        >
          {item.priority}
        </span>
      </div>

      <p>{item.description}</p>
      <p>Due: {item.dueDate}</p>

      <PrioritySelector
        item={item}
        dispatch={dispatch}
        fetchTodos={fetchTodos}
        state={state}
      />

      <TodoActions
        item={item}
        dispatch={dispatch}
        state={state}
        setEditingTodo={setEditingTodo}
        isCompleted={isCompleted}
      />
    </div>
  );
}
