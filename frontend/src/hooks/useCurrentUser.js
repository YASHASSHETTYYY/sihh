import { useEffect, useState } from "react";
import api from "../lib/api";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await api.get("/auth/me");
        if (mounted) {
          setUser(response.data);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.detail || "Unable to load profile");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
};
