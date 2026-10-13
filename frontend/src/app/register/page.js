"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import Link from "next/link";

function EyeIcon({ visible }) {
  return visible ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.9 5.2A10.8 10.8 0 0112 5c5.2 0 8.7 4.7 9.5 7-.3 1.1-1.3 2.6-2.8 3.9M6.2 6.2C3.9 7.7 2.8 10.1 2.5 12c.8 2.3 4.3 7 9.5 7 1.3 0 2.5-.3 3.6-.8"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3zM3.5 7.5V17L12 21l8.5-4V7.5M12 12v9M7.75 5.25l8.5 4.5"
      />
    </svg>
  );
}

export default function Register() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (username.trim().length === 0) {
      setError("Please enter a username.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const registeredUser = await registerUser(username, password);

      if (registeredUser.status === 201) {
        setUsername("");
        setPassword("");
        setMessage("Account created successfully! Redirecting you to login...");

        setTimeout(() => {
          router.push("/login");
        }, 1800);

        return;
      }

      if (registeredUser.status === 409) {
        setError("That username is already taken. Try another one.");
      } else if (registeredUser.status === 400) {
        setError(
          registeredUser.data?.message ||
          "Please check your details and try again."
        );
      } else {
        setError(
          registeredUser.data?.message ||
          `Something went wrong (status ${registeredUser.status}).`
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white md:flex lg:p-12">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
          />

          <div className="relative">
            <Link href="/" className="cursor-pointer inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <PackageIcon />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Smart Inventory
              </span>
            </Link>

            <div className="mt-20 max-w-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Get started
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Your inventory.
                <br />
                Under control.
              </h1>
              <p className="mt-5 leading-7 text-slate-300">
                Create your account and get ready to manage products, monitor
                stock levels, and keep your inventory organized.
              </p>
            </div>
          </div>

          <div className="relative mt-16 border-t border-white/10 pt-6">
            <p className="text-sm text-slate-400">
              A clearer view of your inventory starts here.
            </p>
          </div>
        </section>

        {/* Registration form */}
        <section className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="mx-auto max-w-md">
            <Link
              href="/"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 md:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <PackageIcon />
              </span>
              Smart Inventory
            </Link>

            <div className="mt-8 md:mt-2">
              <p className="text-sm font-semibold text-blue-600">
                CREATE YOUR ACCOUNT
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Get started
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in your details to create your Smart Inventory account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <span className="text-xs text-slate-400">8+ characters</span>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="cursor-pointer absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-400 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-700/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="cursor-pointer font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Log in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to use Smart Inventory
              responsibly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}