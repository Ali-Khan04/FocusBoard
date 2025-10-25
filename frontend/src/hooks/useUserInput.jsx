import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { useGlobal } from "./useGlobal";
import { useTodos } from "./useTodos";

export function useUserInput() {
  const { state, dispatch } = useGlobal();
  const { fetchTodos } = useTodos();
  const [selectedPriority, setSelectedPriority] = useState("Medium");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    dispatch({ type: "userInput", payload: { id: "dueDate", value: today } });
  }, [dispatch]);

  const handleUserInput = (e) => {
    dispatch({
      type: "userInput",
      payload: { id: e.target.id, value: e.target.value },
    });
  };

  const sortArrayByPriority = (arr) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return arr
      .slice()
      .sort(
        (a, b) =>
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
      );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, dueDate } = state.userInput;

    if (!title?.trim() || !description?.trim()) {
      dispatch({ type: "errorMessage", payload: "Please fill in all fields" });
      return;
    }

    const priority = selectedPriority || "Medium";

    if (state.isGuest || !state.user) {
      const newTodo = {
        id: Date.now() + Math.random(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        createdAt: new Date().toLocaleDateString(),
      };

      const newTodos = sortArrayByPriority([...state.todo, newTodo]);
      dispatch({ type: "ADD_TODO", payload: newTodo });
      dispatch({ type: "successMessage", payload: "Todo added locally!" });
      resetForm();
      return;
    }
    dispatch({ type: "isLoading", payload: true });
    try {
      await apiRequest("/user/saveTodos", "POST", {
        title,
        description,
        dueDate,
        priority,
      });
      await fetchTodos();
      dispatch({
        type: "successMessage",
        payload: "Todo saved to your account!",
      });
      resetForm();
      dispatch({ type: "isLoading", payload: false });
    } catch (err) {
      console.error("Error saving todo:", err);
      dispatch({
        type: "errorMessage",
        payload: "Failed to save todo. Please try again.",
      });
      dispatch({ type: "isLoading", payload: false });
    }
    setTimeout(() => {
      dispatch({ type: "clearMessage" });
    }, 2000);
  };

  const resetForm = () => {
    dispatch({ type: "reset" });
    setSelectedPriority("Medium");
    const today = new Date().toISOString().split("T")[0];
    dispatch({ type: "userInput", payload: { id: "dueDate", value: today } });
  };

  return {
    state,
    selectedPriority,
    setSelectedPriority,
    handleUserInput,
    handleSubmit,
  };
}
