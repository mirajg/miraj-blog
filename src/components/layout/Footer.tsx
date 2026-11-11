
import Container from "@/components/layout/Container";
import { PORTFOLIO_URL, SITE_NAME } from "@/constants/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container className="flex flex-wrap items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <p>
          <a href={PORTFOLIO_URL}>Portfolio</a>
        </p>
      </Container>
    </footer>
  );
}