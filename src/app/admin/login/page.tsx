
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 px-6 py-16 text-zinc-100 sm:py-24">
      <div className="mx-auto max-w-sm">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Private area
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin login
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Sign in to manage your blog posts.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}