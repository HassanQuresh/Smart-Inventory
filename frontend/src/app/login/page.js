"use client";
import { useState, useContext } from "react";
import { loginUser } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [message, setMessage] = useState("");
  const { refreshUser } = useContext(AuthContext);
  function updateUsername(event) {
    setUsername(event.target.value);
  }
  function updatePassword(event) {
    setPassword(event.target.value);
  }
  async function handleLogin(event) {
    event.preventDefault();
    setIsLogging(true);
    try {
      const loggedInUser = await loginUser(username, password);
      if (loggedInUser.status === 200) {
        await refreshUser();
        router.replace("/dashboard");
        return;
      }
      setMessage(
        loggedInUser.data?.message ||
        `Unexpected error occurred (Status: ${loggedInUser.status})`
      );
      setIsLogging(false);
    } catch (error) {
      console.error(error);
      setIsLogging(false);
      setMessage("Unable to login. Please try again.");
    }
  }
  return (
    <>
    <Link href={"/register"}>Register</Link>
      <form onSubmit={handleLogin}>
        <h1>Login form</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="username"
          value={username}
          onChange={updateUsername}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={updatePassword}
        />
        <button>{isLogging ? "Logging..." : "Login"}</button>
      </form>
      <h3>{message}</h3>
    </>
  );
}
