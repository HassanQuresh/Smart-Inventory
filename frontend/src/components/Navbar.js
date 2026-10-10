"use client"
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState("");
  const router = useRouter();
  async function handleLogout() {
    const result = await logout();
    if (result.status !== 200) {
      setError(result.data?.message || "Logout failed. Please try again.");
    }
  }
  return (
    <nav>
      {error && <p>{error}</p>}
      <button onClick={() => router.push("/dashboard")}>
        Dashboard
      </button>

      <button onClick={() => router.push("/products")}>
        Products
      </button>
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
};