
import Link from "next/link";
import Container from "@/components/layout/Container";
import { PORTFOLIO_URL, SITE_NAME } from "@/constants/site";

export default function Header() {
  return (
    <header className="site-header">
      <Container>
        <nav className="nav" aria-label="Main">
          <Link href="/" className="logo">
            {SITE_NAME}
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <a href={PORTFOLIO_URL}>Portfolio</a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}