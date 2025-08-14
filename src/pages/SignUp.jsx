import "../CSS/signUp.css";
function SignUp() {
  return (
    <div className="sign-up-container">
      <h1>SignUp</h1>
      <form>
        <input type="text" required placeholder="Name" />
        <input type="email" required placeholder="Email" />
        <input type="password" required placeholder="password" />
        <button>SignUp</button>
      </form>
    </div>
  );
}

export default SignUp;
