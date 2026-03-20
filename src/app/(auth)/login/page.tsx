"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { login } from "@/app/(internal)/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-surface-950">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-surface-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-9 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm text-surface-900 outline-none transition-all placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-9 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm text-surface-900 outline-none transition-all placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-surface-400">
        Access is by invitation only.
      </p>
    </>
  );
}
