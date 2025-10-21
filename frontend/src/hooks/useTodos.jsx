import { useState, useEffect } from "react";
import { useGlobal } from "./useGlobal.jsx";
import { apiRequest } from "../services/api.js";

export const useTodos = () => {
  const { state, dispatch } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const fetchTodos = async () => {
    if (!state.user || state.isGuest) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest("/user/getTodos", "GET");

      dispatch({ type: "SET_TODOS", payload: data.todos || [] });
      setHasInitialFetch(true);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err.message || "Failed to fetch todos");
      dispatch({ type: "SET_TODOS", payload: [] });
      setHasInitialFetch(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.user && !state.isGuest && !hasInitialFetch && !loading) {
      fetchTodos();
    }
  }, [state.user, state.isGuest, hasInitialFetch]);

  return { loading, error, fetchTodos, hasData: hasInitialFetch };
};
