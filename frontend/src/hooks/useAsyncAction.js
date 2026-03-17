import { useCallback, useState } from "react";

export const useAsyncAction = (action) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError("");
        return await action(...args);
      } catch (requestError) {
        setError(requestError.response?.data?.detail || requestError.message || "Request failed");
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { execute, loading, error, setError };
};
