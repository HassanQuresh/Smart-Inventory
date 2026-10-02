"use client";
import { useState, useContext } from "react";
import { loginUser } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [message, setMessage] = useState("");
  const { refreshUser, logout } = useContext(AuthContext);
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
        setIsLogging(false);
        setUsername("");
        setPassword("");
        setMessage(loggedInUser.data.message);
      } else if (loggedInUser.status === 400) {
        setIsLogging(false);
        setMessage(loggedInUser.data.message);
      } else if (loggedInUser.status === 401) {
        setIsLogging(false);
        setMessage(loggedInUser.data.message);
      } else {
        setIsLogging(false);
        setMessage(
          `Unexpected error occurred (Status: ${loggedInUser.status})`,
        );
      }
    } catch (error) {
      console.error(error);
      setIsLogging(false);
      setMessage("Unable to login. Please try again.");
    }
  }
  return (
    <>
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
        <button type="button" onClick={logout}>
          Logout
        </button>
      </form>
      <h3>{message}</h3>
    </>
  );
}
