
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
    <article>
      <h1>About</h1>

      {/* Replace with your real story. Keep it personal and specific. */}
      <p>Hi, I&apos;m Miraj Gautam, a developer.</p>
      <p>
        This blog is where I write about the things I actually build, learn and
        struggle with, so the next person facing the same problem can save some
        time.
      </p>

      <h2>What I write about</h2>
      <p>Web development, JavaScript/TypeScript, AI/ML, and my own projects.</p>

      <h2>Elsewhere</h2>
      <p>
        See my projects and background on my{" "}
        <a href={PORTFOLIO_URL}>portfolio</a>.
      </p>
    </article>
  );
}