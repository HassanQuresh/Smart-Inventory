"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      <h1>Smart Inventory</h1>
      <p>
        Track products, stock levels and inventory value, with separate
        permissions for managers and employees.
      </p>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </main>
  );
}