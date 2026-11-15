
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Analytics } from "@vercel/analytics/next"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Analytics />
      <Header />
      <Container as="main">{children}</Container>
      <Footer />
    </>
  );
}