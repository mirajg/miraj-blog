
import type { Metadata } from "next";
import { PORTFOLIO_URL } from "@/constants/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Miraj Gautam, a developer who writes about what he builds and learns.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">

      <section className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-24">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            About me
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            About
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            A little about who I am, what I build, and why I write.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
        <article className="space-y-10">
          {/* Introduction */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/10 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Hi, I&apos;m Miraj.
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
              I&apos;m a developer who enjoys building things and figuring out
              how they work.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-400 sm:text-lg">
              This blog is where I write about the things I actually build,
              learn and struggle with, so the next person facing the same
              problem can save some time.
            </p>
          </section>


          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/10 sm:p-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-purple-400">
              What I write about
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Things I&apos;m learning and building
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
              Web development, JavaScript/TypeScript, AI/ML, and my own
              projects.
            </p>
          </section>


          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/10 sm:p-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.15em] text-blue-400">
              Elsewhere
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Find more of my work
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">
              See my projects and background on my{" "}
              <a
                href={PORTFOLIO_URL}
                className="font-medium text-blue-400 underline decoration-blue-400/30 underline-offset-4 transition-colors hover:text-blue-300 hover:decoration-blue-300"
              >
                portfolio
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}