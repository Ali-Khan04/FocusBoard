import { useState, useEffect } from "react";
import { useGlobal } from "./useGlobal.jsx";

export const useTodos = () => {
  const { state, dispatch } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const fetchTodos = async () => {
    if (!state.user || state.isGuest) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/user/getTodos", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_TODOS", payload: data.todos });
        console.log("GetTodos: ", data.todos);
        setHasInitialFetch(true);
      } else {
        if (response.status === 404 || response.status === 200) {
          dispatch({ type: "SET_TODOS", payload: [] });
          setHasInitialFetch(true);
        } else {
          setError("Failed to fetch todos");
        }
      }
    } catch (err) {
      setError("Error fetching todos");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.user && !state.isGuest && !hasInitialFetch && !loading) {
      fetchTodos();
    }
  }, [state.user, state.isGuest, hasInitialFetch]);

  useEffect(() => {
    if (!state.user || state.isGuest) {
      setHasInitialFetch(false);
      setError(null);
      if (!state.isGuest && !state.user) {
        dispatch({ type: "SET_TODOS", payload: [] });
      }
    }
  }, [state.user, state.isGuest]);

  return {
    loading,
    error,
    fetchTodos,
    hasData: hasInitialFetch,
  };
};
