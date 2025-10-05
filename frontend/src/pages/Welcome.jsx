import { useNavigate, Link } from "react-router-dom";
import "../CSS/welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to My TodoApp</h1>
        <p>Organize your tasks efficiently and stay productive every day!</p>
        <div className="welcome-buttons">
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className="signin-btn" onClick={() => navigate("/signin")}>
            Sign In
          </button>
        </div>
        <p>
          <Link
            to={"/todo"}
            style={{
              color: "white",
              textDecoration: "underline",
              fontSize: "1rem",
              fontWeight: "500",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
            or Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
