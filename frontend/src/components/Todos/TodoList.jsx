import TodoItem from "./TodoItem.jsx";
import EmptyTodo from "./EmptyTodo.jsx";
import "../../CSS/renderTodo.css";

export default function TodoList({
  todos,
  dispatch,
  fetchTodos,
  state,
  setEditingTodo,
  isCompleted = false,
}) {
  if (!todos || todos.length === 0) return <EmptyTodo />;

  return (
    <div className="render-container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          item={todo}
          dispatch={dispatch}
          fetchTodos={fetchTodos}
          state={state}
          setEditingTodo={setEditingTodo}
          isCompleted={isCompleted}
        />
      ))}
    </div>
  );
}
