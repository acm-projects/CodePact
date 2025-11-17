// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch the current user once on mount (from cp_jwt cookie)
  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include", // send cp_jwt cookie
        });

        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setAuthLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            const u = data.data || data.user;
            setUser(u);
          } else {
            setUser(null);
          }
          setAuthLoading(false);
        }
      } catch (err) {
        console.error("auth/me error:", err);
        if (!cancelled) {
          setUser(null);
          setAuthLoading(false);
        }
      }
    }

    fetchMe();
    return () => {
      cancelled = true;
    };
  }, []);

  // 🔹 Real logout: call backend to clear cookie, then clear local state
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Clear auth state on the frontend
    setUser(null);
  };

  const value = {
    user,
    authLoading,
    setUser, // used after login / profile changes
    logout,  // used by Logout button
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
