"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function updateUsername(event) {
    setUsername(event.target.value);
  }
  function updatePassword(event) {
    setPassword(event.target.value);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    if (password.length < 8) {
      setError("Password must be 8 characters long.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const registeredUser = await registerUser(username, password);
      if (registeredUser.status === 201) {
        setUsername("");
        setPassword("");
        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (registeredUser.status === 400) {
        setIsSubmitting(false);
        setMessage(registeredUser.data.message);
      } else if (registeredUser.status === 409) {
        setIsSubmitting(false);
        setMessage("Username is already taken");
      } else {
        setIsSubmitting(false);
        setMessage(
          `Unexpected error occurred (Status: ${registeredUser.status})`,
        );
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setMessage("Unable to connect to the server. Please try again.");
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Account Registration</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={updateUsername}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={updatePassword}
        />
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {error && <div>{error}</div>}
      <h3>{message}</h3>
    </>
  );
}
//     Username: testmanager42
// Password: InventoryTest123!
