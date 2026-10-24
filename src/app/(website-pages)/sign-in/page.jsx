
"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SIGN IN FORM SUBMITTED");

    setError("");

    if (!API_BASE_URL) {
      setError(
        "API URL is missing. Check your frontend .env.local file."
      );
      console.error("NEXT_PUBLIC_API_BASE_URL is missing");
      return;
    }

    const apiUrl = `${API_BASE_URL.replace(/\/+$/, "")}/auth/login`;

    console.log("Login API URL:", apiUrl);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending login request...");

      const response = await axios.post(
        apiUrl,
        {
          email: email.trim().toLowerCase(),
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response status:", response.status);
      console.log("Login successful:", response.data?.success);

      if (!response.data?.success) {
        setError(
          response.data?.message || "Unable to sign in."
        );
        return;
      }

      // Preserve the destination requested before login.
      const params = new URLSearchParams(window.location.search);
      const requestedPath = params.get("redirect") || "/checkout";

      // Allow only safe local paths.
      const safePath =
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        !requestedPath.includes("\\")
          ? requestedPath
          : "/checkout";

      console.log("Redirecting to:", safePath);

      // Navigate after the login response has been received.
      window.location.assign(safePath);
    } catch (err) {
      console.error("SIGN IN ERROR:", err);
      console.error("Login status:", err.response?.status);
      console.error("Login response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          (err.response
            ? `Sign in failed (${err.response.status}). Please check your details.`
            : "Cannot connect to the server. Check that your backend is running.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#faf7f3] px-4 py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Brand panel */}
        <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#38261e] p-8 text-white sm:p-10 md:min-h-[600px]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-[#c79569]/30" />
          <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full border border-[#c79569]/30" />

          <Link
            href="/"
            className="relative text-2xl font-medium tracking-[0.25em]"
          >
            NESTRO<span className="text-[#c79569]">.</span>
          </Link>

          <div className="relative my-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d8ad88]">
              Welcome to Nestro
            </p>

            <h1 className="max-w-sm text-4xl font-medium leading-tight sm:text-5xl">
              Make yourself at home.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              Thoughtfully designed furniture for the spaces and moments
              that matter most.
            </p>
          </div>

          <p className="relative text-xs tracking-wide text-white/50">
            TIMELESS DESIGN. EVERYDAY COMFORT.
          </p>
        </section>

        {/* Sign-in form */}
        <section className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            <p className="text-sm font-medium text-[#a66e43]">
              YOUR NESTRO ACCOUNT
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-[#30231d]">
              Sign in
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Welcome back. Enter your details to continue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#30231d]"
                >
                  Email address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#e8ded5] px-4 focus-within:border-[#a66e43]">
                  <Mail
                    size={18}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-full w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#30231d]"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#a66e43] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#e8ded5] px-4 focus-within:border-[#a66e43]">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-full w-full bg-transparent text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="shrink-0 text-gray-400 hover:text-[#a66e43]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#38261e] px-4 font-semibold text-white transition hover:bg-[#50372b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              New to Nestro?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#a66e43] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-8 border-t border-[#eee5dd] pt-5 text-center text-xs leading-5 text-gray-400">
              Your account helps keep your orders and details in one place.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
