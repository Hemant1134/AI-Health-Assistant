"use client";
import { createContext, useState, useEffect } from "react";
import { profileAPI } from "@/lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserOnLoad() {
    try {
      const res = await profileAPI();
      setUser(res.data.user);   //  If logged in, store user
    } catch {
      setUser(null);            // If not logged in, keep null
    } finally {
      setLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const res = await profileAPI();
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUserOnLoad(); // Runs ONLY once on refresh or app load
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
