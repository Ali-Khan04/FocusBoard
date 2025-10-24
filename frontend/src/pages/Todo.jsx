import { useGlobal } from "../hooks/useGlobal.jsx";
import { useNavigate } from "react-router-dom";
import RenderTodo from "../components/Todos/RenderTodo.jsx";
import { apiRequest } from "../services/api.js";
import "../CSS/Notification.css";

function Todo() {
  const { dispatch, state } = useGlobal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", "POST");
      dispatch({ type: "logout" });

      dispatch({
        type: "successMessage",
        payload: "Logged out successfully ",
      });

      navigate("/signIn");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch({
        type: "errorMessage",
        payload: "Error logging out. Please try again.",
      });
    }
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  const handleClick = () => {
    if (state.user) {
      handleLogout();
    } else {
      navigate("/signIn");
    }
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  return (
    <>
      {state.flowMessage && (
        <p
          className={`global-message ${
            state.messageType === "error" ? "error-text" : "success-text"
          }`}
        >
          {state.flowMessage}
        </p>
      )}

      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#ff5252",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {!state.user ? "Sign In" : "Logout"}
      </button>
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
