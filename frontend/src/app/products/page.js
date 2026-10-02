"use client";
import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function Products() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (!user) {
    return <h1>You are not logged in.</h1>;
  }
  return (
    <>
      <h1>Products Page</h1>
    </>
  );
}
