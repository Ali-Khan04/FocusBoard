import { useReducer } from "react";
import { GlobalContext } from "./GlobalContext";

const initialState = {
  todo: [],
  userInput: {
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0], // Default to today
  },
  userSignUp: {
    name: "",
    email: "",
    password: "",
  },
  userSignIn: {
    email: "",
    password: "",
  },
  flowMessage: "",
  messageType: "",
  user: JSON.parse(localStorage.getItem("user")) || null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "todo":
      return {
        ...state,
        todo: [
          ...state.todo,
          { ...action.payload, id: Date.now() + Math.random() },
        ],
      };
    case "userInput":
      return {
        ...state,
        userInput: {
          ...state.userInput,
          [action.payload.id]: action.payload.value,
        },
      };

    case "delete":
      return {
        ...state,
        todo: state.todo.filter((item) => item.id !== action.payload),
      };
    case "signUp":
      return {
        ...state,
        userSignUp: {
          ...state.userSignUp,
          [action.payload.id]: action.payload.value,
        },
      };
    case "signIn":
      return {
        ...state,
        userSignIn: {
          ...state.userSignIn,
          [action.payload.id]: action.payload.value,
        },
      };

    case "SET_TODOS":
      return {
        ...state,
        todo: (action.payload || []).map((todo) => ({
          ...todo,
          id: todo._id || todo.id,
        })),
      };
    case "updateTodoPriority":
      return {
        ...state,
        todo: state.todo.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, priority: action.payload.priority }
            : todo
        ),
      };

    case "successMessage":
      return {
        ...state,
        flowMessage: action.payload,
        messageType: "success",
      };

    case "errorMessage":
      return {
        ...state,
        flowMessage: action.payload,
        messageType: "error",
      };

    case "clearMessage":
      return {
        ...state,
        flowMessage: "",
        messageType: "",
      };
    case "reset":
      const today = new Date().toISOString().split("T")[0]; // Set dueDate to today because past dates are not allowed
      return {
        ...state,
        userInput: {
          title: "",
          description: "",
          dueDate: today,
        },
      };
    case "signUpReset":
      return { ...state, userSignUp: { name: "", email: "", password: "" } };
    case "SET_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case "Update_User":
      return { ...state, user: action.payload };
    case "logout":
      localStorage.removeItem("user");
      return { ...state, user: null, todo: [] };
    default:
      return state;
  }
};
function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
