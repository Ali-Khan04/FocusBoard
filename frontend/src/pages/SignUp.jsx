import "../CSS/signUp.css";
import { useNavigate, Link } from "react-router-dom";
import { useGlobal } from "../hooks/useGlobal.jsx";

function SignUp() {
  const { state, dispatch } = useGlobal();
  const navigate = useNavigate();
  const handleFormData = (e) => {
    dispatch({
      type: "signUp",
      payload: { id: e.target.id, value: e.target.value },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = state.userSignUp;
    dispatch({ type: "clearMessage" });
    try {
      const response = await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        dispatch({
          type: "successMessage",
          payload: "User registered successfully!",
        });

        dispatch({ type: "signUpReset" });

        setTimeout(() => {
          navigate("/signIn");
        }, 2000);
      } else {
        dispatch({
          type: "errorMessage",
          payload: data.message || "Registration failed",
        });
      }
    } catch (err) {
      dispatch({ type: "errorMessage", payload: "Error Registering User" });
    }
    dispatch({ type: "signUpReset" });
  };
  return (
    <div className="signup-page">
      <div className="sign-up-container">
        <h1>SignUp</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Name"
            id="name"
            value={state.userSignUp.name}
            onChange={handleFormData}
          />
          <input
            type="email"
            required
            placeholder="Email"
            id="email"
            value={state.userSignUp.email}
            onChange={handleFormData}
          />
          <input
            type="password"
            required
            placeholder="password"
            id="password"
            value={state.userSignUp.password}
            onChange={handleFormData}
          />
          <button className="button-sign">SignUp</button>
        </form>
        <Link to="/signin">Already have an account? Sign In</Link>
        {state.flowMessage && (
          <p
            className={
              state.messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {state.flowMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignUp;
