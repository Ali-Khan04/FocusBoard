import UserInput from "./userInput";
import { useState } from "react";
function RenderTodo() {
  const [todoArray, setTodoArray] = useState([]);
  const handleTodoArray = (newTodo) => {
    setTodoArray((oldState) => [...oldState, newTodo]);
  };
  return (
    <div className="render-container">
      <UserInput getTodo={handleTodoArray} />
      {todoArray.map((item, index) => (
        <div key={index} className="todo-contianer">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <p>{item.date}</p>
          <button>Delete</button>
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
