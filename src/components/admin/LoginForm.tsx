
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={`${inputClass} w-full rounded-xl border-zinc-800 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-blue-500/20`}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${inputClass} w-full rounded-xl border-zinc-800 bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-blue-500/20`}
        />
      </Field>

      {error && (
        <div
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3 font-mediumtransition-all text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}