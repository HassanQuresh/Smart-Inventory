"use client";

import { useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    setError("");
    setIsLoggingOut(true);

    try {
      const result = await logout();

      if (result.status !== 200) {
        setError(result.data?.message || "Logout failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "▦" },
    { label: "Products", href: "/products", icon: "□" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Brand */}
        <button
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer flex shrink-0 items-center gap-3 text-left"
          aria-label="Go to dashboard"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
            S
          </span>

          <span className="hidden sm:block">
            <span className="block text-base font-bold tracking-tight text-slate-900">
              Smart Inventory
            </span>
            <span className="block text-xs text-slate-500">
              Inventory management
            </span>
          </span>
        </button>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href === "/products" && pathname.startsWith("/products"));

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`cursor-pointer flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-4 ${isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                  }`}
              >
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User and logout */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role || "Account"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="border-t border-red-100 bg-red-50 px-5 py-3 text-center text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}
    </header>
  );
}