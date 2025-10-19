import { useState } from "react";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import { useTodos } from "../../hooks/useTodos.jsx";
import UserInput from "../UserInput.jsx";
import TodoList from "./TodoList.jsx";
import UpdateTodo from "../UpdateTodo.jsx";
import "../../CSS/renderTodo.css";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  const { loading, error, fetchTodos } = useTodos();
  const [editingTodo, setEditingTodo] = useState(null);

  const todos = state.todo;

  return (
    <>
      <div className="input-section">
        <UserInput />
      </div>

      {loading && !state.isGuest && <p>Loading your todos...</p>}
      {error && !state.isGuest && <p>Error loading todos</p>}

      <div className="welcome-header">
        <h2>
          {state.isGuest
            ? "Welcome, Guest 👋"
            : `Welcome back, ${state.user?.name} 👋`}
        </h2>
        <p>
          {todos.length > 0
            ? "Here are your todos (sorted by priority):"
            : "Add todos to get started!"}
        </p>
      </div>

      <TodoList
        todos={todos}
        dispatch={dispatch}
        fetchTodos={fetchTodos}
        state={state}
        setEditingTodo={setEditingTodo}
      />

      {editingTodo && (
        <UpdateTodo todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
    </>
  );
}

export default RenderTodo;
