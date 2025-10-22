import { useReducer, useEffect } from "react";
import { GlobalContext } from "./GlobalContext";

const initialState = {
  todo: [],
  completed: [],
  userInput: {
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
  },
  userSignUp: { name: "", email: "", password: "" },
  userSignIn: { email: "", password: "" },
  flowMessage: "",
  messageType: "",
  user: JSON.parse(localStorage.getItem("user")) || null,
  isGuest: JSON.parse(localStorage.getItem("isGuest")) || false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "todo":
      return {
        ...state,
        todo: [
          ...state.todo,
          {
            ...action.payload,
            id: action.payload.id ?? Date.now() + Math.random(),
            priority: action.payload.priority || "Medium",
          },
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
        todo: (action.payload || [])
          .map((todo) => ({ ...todo, id: todo._id || todo.id }))
          .sort((a, b) => {
            const order = { High: 1, Medium: 2, Low: 3 };
            return (order[a.priority] || 999) - (order[b.priority] || 999);
          }),
      };
    case "ADD_TODO":
      return {
        ...state,
        todo: [...state.todo, action.payload].sort((a, b) => {
          const order = { High: 1, Medium: 2, Low: 3 };
          return (order[a.priority] || 999) - (order[b.priority] || 999);
        }),
      };

    case "SET_COMPLETED":
      return {
        ...state,
        completed: (action.payload || []).map((t) => ({
          ...t,
          id: t._id || t.id,
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

    case "delete":
      return {
        ...state,
        todo: state.todo.filter((t) => t.id !== action.payload),
      };

    case "update":
      return {
        ...state,
        todo: state.todo.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.update } : t
        ),
      };

    case "markDone": {
      const done = state.todo.find((t) => t.id === action.payload);
      if (!done) return state;
      return {
        ...state,
        todo: state.todo.filter((t) => t.id !== action.payload),
        completed: [...state.completed, { ...done }],
      };
    }

    case "successMessage":
      return { ...state, flowMessage: action.payload, messageType: "success" };
    case "errorMessage":
      return { ...state, flowMessage: action.payload, messageType: "error" };
    case "clearMessage":
      return { ...state, flowMessage: "", messageType: "" };

    case "reset": {
      const today = new Date().toISOString().split("T")[0];
      return {
        ...state,
        userInput: {
          title: "",
          description: "",
          dueDate: today,
          priority: "Medium",
        },
      };
    }
    case "signUpReset":
      return { ...state, userSignUp: { name: "", email: "", password: "" } };
    case "signInReset":
      return { ...state, userSignIn: { email: "", password: "" } };

    case "SET_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.removeItem("isGuest");
      return { ...state, user: action.payload, isGuest: false };

    case "Update_User":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case "SET_GUEST_MODE":
      localStorage.setItem("isGuest", "true");
      return { ...state, isGuest: true, user: null };

    case "logout":
      localStorage.removeItem("user");
      localStorage.removeItem("isGuest");
      localStorage.removeItem("guestTodos");
      localStorage.removeItem("guestCompleted");
      return { ...state, user: null, todo: [], completed: [], isGuest: false };

    default:
      return state;
  }
};

function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  //Save guest data to localStorage
  useEffect(() => {
    if (state.isGuest) {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem("isGuest", JSON.stringify(true));
          localStorage.setItem("guestTodos", JSON.stringify(state.todo || []));
          localStorage.setItem(
            "guestCompleted",
            JSON.stringify(state.completed || [])
          );
          console.log("✅ Saved guest todos (delayed):", state.todo);
        } catch (err) {
          console.error("Failed to save guest data:", err);
        }
      }, 100); //delay for react to finish updating

      return () => clearTimeout(saveTimeout);
    }
  }, [state.todo, state.completed, state.isGuest]);

  //Load guest data immediately when app starts
  useEffect(() => {
    try {
      const isGuest = JSON.parse(localStorage.getItem("isGuest"));
      if (isGuest) {
        const savedTodos = JSON.parse(localStorage.getItem("guestTodos")) || [];
        const savedCompleted =
          JSON.parse(localStorage.getItem("guestCompleted")) || [];

        console.log("📦 Loaded guest data:", savedTodos);

        dispatch({ type: "SET_GUEST_MODE" }); // ensures Guest is true
        dispatch({ type: "SET_TODOS", payload: savedTodos });
        dispatch({ type: "SET_COMPLETED", payload: savedCompleted });
      }
    } catch (err) {
      console.error("Failed to load guest data:", err);
    }
  }, [dispatch]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
