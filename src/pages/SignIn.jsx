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
        navigate("/todo");
      } else {
        dispatch({
          type: "errorMessage",
          payload: data.message || "SignIn failed",
        });
      }
    } catch (err) {
      dispatch({ type: "errorMessage", payload: "Error Sigining In" });
    }
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
            placeholder="password"
            id="password"
            onChange={hanldeUserInput}
          />
          <button className="button-sign">Sign In</button>
        </form>
        <Link to="/signup">No account? Sign Up</Link>
        {state.flowMessage && (
          <p
            className={
              state.messageType === "error" ? "error-message" : undefined
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
