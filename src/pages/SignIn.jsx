import "../CSS/signUp.css";
import { Link } from "react-router-dom";
function SignIn() {
  return (
    <div className="sign-in-container">
      <h1>Sign in</h1>
      <form>
        <input type="email" required placeholder="Email" />
        <input type="password" required placeholder="password" />
        <button className="button-sign">Sign In</button>
      </form>
      <Link to="/signup">No account? Sign Up</Link>
    </div>
  );
}

export default SignIn;
