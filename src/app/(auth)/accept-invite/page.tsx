"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Supabase automatically exchanges the token from the URL hash
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setReady(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setPending(false);
    } else {
      router.push("/dashboard");
    }
  }

  if (!ready) {
    return (
      <>
        <h2 className="mb-2 text-lg font-semibold text-surface-950">Accepting invite…</h2>
        <p className="text-sm text-surface-500">Please wait while we verify your invitation.</p>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-surface-950">Set your password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="h-9 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm text-surface-900 outline-none transition-all placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Setting password…" : "Set password & continue"}
        </Button>
      </form>
    </>
  );
}
