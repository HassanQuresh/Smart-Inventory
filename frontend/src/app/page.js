"use client";
import { useEffect, useState } from "react";
export default function Home() {
  const [message, setMessage] = useState("Connecting to backend...");
  useEffect(() => {
    async function getBackendMessage(){
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
      const data = await response.text();
      setMessage(data);
    };
    getBackendMessage();
  }, []);

  return (
    <main>
      <h1>Smart Inventory</h1>
      <p>{message}</p>
    </main>
  );
}