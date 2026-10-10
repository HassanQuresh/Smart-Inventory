"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function ProtectedLayout({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}