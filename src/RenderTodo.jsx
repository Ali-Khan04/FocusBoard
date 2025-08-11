import UserInput from "./userInput";
import { useState } from "react";
function RenderTodo() {
  const [todoArray, setTodoArray] = useState([]);
  const handleTodoArray = (newTodo) => {
    setTodoArray((oldState) => [
      ...oldState,
      { ...newTodo, id: Date.now() + Math.random() },
    ]);
  };
  const handleDelete = (id) => {
    setTodoArray(todoArray.filter((item) => item.id !== id));
  };
  return (
    <div className="render-container">
      <UserInput getTodo={handleTodoArray} />
      {todoArray.map((item) => (
        <div key={item.id} className="todo-contianer">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <p>{item.date}</p>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
          <button>Update</button>
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
  );
}

export default RenderTodo;
