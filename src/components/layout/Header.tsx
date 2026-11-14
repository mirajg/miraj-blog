
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/layout/Container";
import { PORTFOLIO_URL, SITE_NAME } from "@/constants/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <Container>
        <nav
          ref={menuRef}
          className="relative flex min-h-16 items-center justify-between"
          aria-label="Main"
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="text-lg font-bold tracking-tight text-white transition-colors hover:text-blue-400"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link
                href="/blog"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Blog
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                About
              </Link>
            </li>

            <li>
              <a
                href={PORTFOLIO_URL}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Portfolio
              </a>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white md:hidden"
          >
            <span className="relative block h-5 w-5">
              {/* Top line */}
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ${open ? "rotate-45" : "-translate-y-2"
                  }`}
              />

              {/* Middle line */}
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ${open ? "scale-0 opacity-0" : ""
                  }`}
              />

              {/* Bottom line */}
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ${open ? "-rotate-45" : "translate-y-2"
                  }`}
              />
            </span>
          </button>

          {/* Mobile menu */}
          <div
            className={`absolute right-0 top-16 w-52 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200 md:hidden ${open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-2 scale-95 opacity-0"
              }`}
          >
            <ul className="space-y-1">
              <li>
                <Link
                  href="/blog"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <a
                  href={PORTFOLIO_URL}
                  onClick={closeMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
}