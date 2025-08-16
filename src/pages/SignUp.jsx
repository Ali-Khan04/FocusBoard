import "../CSS/signUp.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess("");
    try {
      await fetch("http://localhost:3000/auth/signUp", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSuccess("User registered successfully!");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    }
    setFormData({ name: "", email: "", password: "" });
  };
  return (
    <div className="sign-up-container">
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Name"
          id="name"
          value={formData.name}
          onChange={handleFormData}
        />
        <input
          type="email"
          required
          placeholder="Email"
          id="email"
          value={formData.email}
          onChange={handleFormData}
        />
        <input
          type="password"
          required
          placeholder="password"
          id="password"
          value={formData.password}
          onChange={handleFormData}
        />
        <button className="button-sign">SignUp</button>
      </form>
      <Link to="/signin">Already have an account? Sign In</Link>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}

export default SignUp;
