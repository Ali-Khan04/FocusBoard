import RenderTodo from "../RenderTodo";

function Todo() {
  return (
    <>
      <h1
        style={{
          textAlign: "center",
          margin: "1.5rem 0",
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#ff5252",
        }}
      >
        Todo App
      </h1>

      <RenderTodo />
    </>
  );
}

export default Todo;
