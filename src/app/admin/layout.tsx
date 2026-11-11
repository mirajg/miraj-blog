
import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false }, // keep admin out of search results
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await isAdmin();

  return (
    <div className="min-h-screen">
      {/* The nav only shows when logged in, so the login page stays clean */}
      {loggedIn && (
        <header className="border-b">
          <nav
            className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
            aria-label="Admin"
          >
            <div className="flex items-center gap-4">
              <Link href="/admin" className="font-semibold">
                Admin
              </Link>
              <Link href="/admin/posts/new">New post</Link>
              <Link href="/" target="_blank">
                View site
              </Link>
            </div>

            {/* Plain HTML form: no client JavaScript needed to log out */}
            <form action="/api/auth/logout" method="post">
              <button type="submit">Log out</button>
            </form>
          </nav>
        </header>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}