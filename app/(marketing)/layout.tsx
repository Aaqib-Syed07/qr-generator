import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/*
  Marketing chrome: header and footer on all public pages. The dashboard,
  login and later checkout live in other groups without the marketing nav,
  per the locked rule that they carry no ads.
*/

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
