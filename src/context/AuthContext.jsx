import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/auth/me");

      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    try {
      const response = await apiFetch("/auth/me");

      if (!response.ok) return;

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}