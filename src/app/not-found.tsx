
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="wrap py-16 text-center">
      <p className="text-muted">404</p>
      <h1 className="mt-2">Page not found</h1>
      <p className="mt-4 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <p className="mt-6 flex justify-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </p>
    </main>
  );
}