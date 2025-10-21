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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = state.userSignUp;

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

      dispatch({ type: "signUpReset" });

      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    } catch (err) {
      dispatch({
        type: "errorMessage",
        payload: err.message || "Error registering user",
      });
    }
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };
  return (
    <div className="signup-page">
      <div className="sign-up-container">
        <h1>SignUp</h1>
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
            placeholder="password"
            id="password"
            value={state.userSignUp.password}
            onChange={handleFormData}
          />
          <Button className="button-sign">SignUp</Button>
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
