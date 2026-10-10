"use client";

import { useState, useEffect, createContext } from "react";
import { getCurrentUser, logoutUser } from "@/lib/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();

      if (currentUser.status === 200) {
        setUser(currentUser.data);
      } else {
        setUser(null);
      }

      return currentUser;
    } catch (error) {
      setUser(null);
      return { status: 0, data: { message: "Unable to verify your session." } };
    }
  }

  useEffect(() => {
    async function authCheck() {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    }

    authCheck();
  }, []);

  async function logout() {
    try {
      const result = await logoutUser();

      if (result.status === 200) {
        setUser(null);
      }

      return result;
    } catch (error) {
      return {
        status: 0,
        data: { message: "Unable to log out. Please try again." },
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}