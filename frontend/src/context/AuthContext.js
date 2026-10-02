"use client";
import { useState, useEffect, createContext } from "react";
import { getCurrentUser, logoutUser } from "@/lib/api";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function authCheck() {
      await refreshUser();
      setIsLoading(false);
    }
    authCheck();
  }, []);
  async function refreshUser() {
    const currentUser = await getCurrentUser();
    if (currentUser.status === 200) {
      setUser(currentUser.data);
    } else {
      setUser(null);
    }
  }
  async function logout(){
    const result = await logoutUser();
    if(result.status === 200){
      setUser(null);
    };
  };
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
