import { useGlobal } from "../hooks/useGlobal.jsx";
import { useNavigate } from "react-router-dom";
import RenderTodo from "../components/Todos/RenderTodo.jsx";
import { apiRequest } from "../services/api.js";
import "../CSS/Notification.css";
import { useState } from "react";

function Todo() {
  const { dispatch, state } = useGlobal();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiRequest("/auth/logout", "POST");
      dispatch({ type: "logout" });
      dispatch({ type: "successMessage", payload: "Logged out successfully " });
      navigate("/signIn");
    } catch {
      dispatch({
        type: "errorMessage",
        payload: "Error logging out. Please try again.",
      });
    } finally {
      setLoggingOut(false);
      setTimeout(() => {
        dispatch({ type: "clearMessage" });
      }, 2000);
    }
  };

  const handleClick = () => {
    if (state.user) handleLogout();
    else navigate("/signIn");
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
        className={loggingOut ? "logout-loading" : "btn-logout"}
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
        FocusBoard
      </h1>

      <RenderTodo />
    </>
  );
}

export default Todo;
