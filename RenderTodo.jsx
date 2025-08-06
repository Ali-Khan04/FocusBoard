import UserInput from "./userInput";
import { useState } from "react";
function RenderTodo() {
  const [todoArray, setTodoArray] = useState("");
  const handleTodoArray = (newTodo) => {
    setTodoArray((oldState) => [...oldState, newTodo]);
  };
  return (
    <div>
      <UserInput getTodo={handleTodoArray} />
    </div>
  );
}

export default RenderTodo;
