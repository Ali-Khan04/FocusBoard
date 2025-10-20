import "../CSS/signUp.css";
import { Link } from "react-router-dom";
import { useGlobal } from "../hooks/useGlobal.jsx";
import { useNavigate } from "react-router-dom";
import Input from "../components/shared/Input.jsx";
import Button from "../components/shared/Button.jsx";
import { apiRequest } from "../services/api.js";

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
      const data = await apiRequest("/auth/signIn", "POST", {
        email,
        password,
      });

      dispatch({ type: "SET_USER", payload: data.user });
      dispatch({ type: "successMessage", payload: "Sign In Successful!" });
      navigate("/todo");
    } catch (err) {
      dispatch({
        type: "errorMessage",
        payload:
          err.message || "Error Signing In. Please check your connection.",
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
          <Input
            type="email"
            required
            placeholder="Email"
            id="email"
            value={state.userSignIn.email}
            onChange={hanldeUserInput}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            id="password"
            value={state.userSignIn.password}
            onChange={hanldeUserInput}
          />
          <Button type="submit" className="button-sign">
            Sign In
          </Button>
        </form>

        {/* Guest Mode Button */}
        <Button
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
        </Button>

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
