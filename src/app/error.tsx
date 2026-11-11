
"use client"; // error boundaries must be client components

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // swap for an error-tracking service later
  }, [error]);

  return (
    <main className="wrap py-16 text-center">
      <h1>Something went wrong</h1>
      <p className="mt-4 text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded border px-4 py-2 hover:opacity-70"
        >
          Try again
        </button>
        <Link href="/" className="py-2">
          Home
        </Link>
      </div>
    </main>
  );
}