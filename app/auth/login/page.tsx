"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await signIn(email, password);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    router.push("/"); // back to home (or dashboard)
  }

  return (
    <main className="min-h-screen bg-brand-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">Log in to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-login-btn,#10B981)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-login-btn,#10B981)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-login-btn text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link className="text-[var(--color-login-btn,#10B981)] hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
