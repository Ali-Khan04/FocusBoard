import "../CSS/signUp.css";
import { useNavigate, Link } from "react-router-dom";
import { useGlobal } from "../hooks/useGlobal.jsx";
import Button from "../components/shared/Button.jsx";
import Input from "../components/shared/Input.jsx";
import { apiRequest } from "../services/api.js";

function SignUp() {
  const { state, dispatch } = useGlobal();
  const navigate = useNavigate();

  const handleFormData = (e) => {
    dispatch({
      type: "signUp",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const clearMessage = () => {
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = state.userSignUp;
    dispatch({ type: "isLoading", payload: true });

    if (!name || !email || !password) {
      dispatch({
        type: "errorMessage",
        payload: "All fields are required",
      });
      clearMessage();
      return;
    }

    if (name.trim().length < 3 || name.trim().length > 30) {
      dispatch({
        type: "errorMessage",
        payload: "Name must be between 3 and 30 characters",
      });
      clearMessage();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch({
        type: "errorMessage",
        payload: "Invalid email format",
      });
      clearMessage();
      return;
    }

    if (password.length < 6) {
      dispatch({
        type: "errorMessage",
        payload: "Password must be at least 6 characters",
      });
      clearMessage();
      return;
    }

    try {
      const data = await apiRequest("/auth/signUp", "POST", {
        name,
        email,
        password,
      });

      dispatch({
        type: "successMessage",
        payload: "User registered successfully!",
      });
      dispatch({ type: "isLoading", payload: false });
      dispatch({ type: "signUpReset" });
      clearMessage();

      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    } catch (err) {
      dispatch({
        type: "errorMessage",
        payload: err.message || "Error registering user",
      });
      dispatch({ type: "isLoading", payload: false });
      clearMessage();
    }
  };

  return (
    <div className="signup-page">
      <div className="sign-up-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            required
            placeholder="Name"
            id="name"
            value={state.userSignUp.name}
            onChange={handleFormData}
          />
          <Input
            type="email"
            required
            placeholder="Email"
            id="email"
            value={state.userSignUp.email}
            onChange={handleFormData}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            id="password"
            value={state.userSignUp.password}
            onChange={handleFormData}
          />
          <Button
            type="submit"
            className={state.isLoading ? "signUp-loading" : "button-sign"}
          >
            SignUp
          </Button>
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
