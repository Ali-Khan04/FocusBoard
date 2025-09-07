import UserInput from "./userInput";
import "./CSS/renderTodo.css";
import { useGlobal } from "./hooks/useGlobal.jsx";
import { useTodos } from "./hooks/useTodos.jsx";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  const { loading, error, fetchTodos } = useTodos();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading your todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={fetchTodos}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="input-section">
        <UserInput />
      </div>
      <>
        <div className="welcome-header">
          <h2>
            {!state.user ? (
              "Sign In for more functionality"
            ) : (
              <>
                Welcome back,
                <span>{state.user.name}</span> 👋
              </>
            )}
          </h2>
          <p>
            {state.todo.length > 0
              ? "Here is your Todo List for today:"
              : "Add todos to get started!"}
          </p>
        </div>
        <div className="render-container">
          {state.todo.map((item) => (
            <div key={item.id} className="todo-contianer">
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              <p>{item.date}</p>
              <div className="edit-buttons">
                <button
                  onClick={() => dispatch({ type: "delete", payload: item.id })}
                >
                  Delete
                </button>
                <button>Update</button>
              </div>

              <label>Priority</label>
              <select>
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          ))}
        </div>
      </>
    </>
  );
}

export default RenderTodo;
