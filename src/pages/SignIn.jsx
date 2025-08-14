import "../CSS/signUp.css";
function SignIn() {
  return (
    <div className="sign-in-container">
      <h1>Sign in</h1>
      <form>
        <input type="email" required placeholder="Email" />
        <input type="password" required placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
