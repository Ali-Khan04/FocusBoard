import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./CSS/App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Todo from "./pages/Todo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signUp" element={<SignUp />} />
        <Route path="signIn" element={<SignIn />} />
        <Route path="/" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
