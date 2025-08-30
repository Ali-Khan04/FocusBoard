import { useReducer } from "react";
import { GlobalContext } from "./GlobalContext";

const initialState = {
  todo: [],
  userInput: {
    title: "",
    description: "",
    date: "",
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
      return {
        ...state,
        userInput: {
          title: "",
          description: "",
          date: "",
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
