import "../CSS/signUp.css";
import { Link } from "react-router-dom";
import { useGlobal } from "../hooks/useGlobal.jsx";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const { state, dispatch } = useGlobal();

  const hanldeUserInput = (e) => {
    dispatch({
      type: "signIn",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state.userSignIn;
    dispatch({ type: "clearMessage" });

    try {
      const response = await fetch("http://localhost:3000/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_USER", payload: data.user });
        dispatch({ type: "successMessage", payload: "Sign In Successful!" });
        navigate("/todo");
      } else {
        const data = await response.json();
        dispatch({
          type: "errorMessage",
          payload: data.message || "SignIn failed",
        });
      }
    } catch (err) {
      dispatch({
        type: "errorMessage",
        payload: "Error Signing In. Please check your connection.",
      });
    }
  };

  const handleGuestMode = () => {
    dispatch({ type: "SET_GUEST_MODE" });
    dispatch({
      type: "successMessage",
      payload: "Continuing as guest. Your todos will be stored locally.",
    });
    navigate("/todo");
  };

  return (
    <div className="sigin-page">
      <div className="sign-in-container">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email"
            id="email"
            value={state.userSignIn.email}
            onChange={hanldeUserInput}
          />
          <input
            type="password"
            required
            placeholder="Password"
            id="password"
            value={state.userSignIn.password}
            onChange={hanldeUserInput}
          />
          <button type="submit" className="button-sign">
            Sign In
          </button>
        </form>

        {/* Guest Mode Button */}
        <button
          type="button"
          onClick={handleGuestMode}
          className="button-guest"
          style={{
            marginTop: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            fontSize: "14px",
          }}
        >
          Continue as Guest
        </button>

        <Link to="/signup">No account? Sign Up</Link>

        {state.flowMessage && (
          <p
            className={
              state.messageType === "error"
                ? "error-message"
                : "success-message"
            }
          >
            {state.flowMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
