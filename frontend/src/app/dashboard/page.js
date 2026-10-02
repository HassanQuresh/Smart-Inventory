"use client";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!user) {
    return <h1>You are not logged in.</h1>;
  }
  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <p>Role: {user.role}</p>
      <h2>Available actions</h2>

      <p>View products</p>
      <p>Update stock</p>

      {user.role === "Manager" && (
        <>
          <p>Create product</p>
          <p>Edit product</p>
          <p>Delete product</p>
        </>
      )}
    </>
  );
}
