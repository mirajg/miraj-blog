import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdmin();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {loggedIn && (
        <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
          <nav
            className="mx-auto flex min-h-16 max-w-5xl items-center justify-between px-6 sm:px-8"
            aria-label="Admin"
          >
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-lg font-bold tracking-tight text-white transition-colors hover:text-blue-400"
              >
                Admin
              </Link>

              <div className="hidden items-center gap-5 sm:flex">
                <Link
                  href="/admin/posts/new"
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  New post
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  View site ↗
                </Link>
              </div>
            </div>

            <LogoutButton />
          </nav>
        </header>
      )}

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}