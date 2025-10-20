import Button from "../shared/Button.jsx";
import { useState } from "react";
import { useGlobal } from "../../hooks/useGlobal.jsx";
import { useTodos } from "../../hooks/useTodos.jsx";
import UserInput from "./userInput.jsx";
import TodoList from "./TodoList.jsx";
import UpdateTodo from "./UpdateTodo.jsx";
import "../../CSS/renderTodo.css";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  const { loading, error, fetchTodos } = useTodos();
  const [editingTodo, setEditingTodo] = useState(null);

  const todos = state.todo;
  const completed = state.completed;

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
            : state.user
            ? `Welcome back, ${state.user.name || "User"} 👋`
            : "Welcome 👋"}
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
      {completed.length > 0 && (
        <div className="clear-section">
          <h3>✅ Completed Todos</h3>
          <Button
            onClick={() => {
              dispatch({ type: "SET_COMPLETED", payload: [] });
              dispatch({
                type: "successMessage",
                payload: "Cleared all completed todos!",
              });
            }}
          >
            Clear Completed
          </Button>
        </div>
      )}
      {completed.length > 0 && (
        <div className="completed-section">
          <TodoList
            todos={completed}
            dispatch={dispatch}
            fetchTodos={fetchTodos}
            state={state}
            setEditingTodo={setEditingTodo}
            isCompleted={true}
          />
        </div>
      )}

      {editingTodo && (
        <UpdateTodo todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
    </>
  );
}

export default RenderTodo;
