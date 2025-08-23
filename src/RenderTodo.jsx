import UserInput from "./userInput";
import "./CSS/renderTodo.css";
import { useGlobal } from "./context/useGlobal";

function RenderTodo() {
  const { state, dispatch } = useGlobal();
  return (
    <>
      <div className="input-section">
        <UserInput />
      </div>
      <>
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
