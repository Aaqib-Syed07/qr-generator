import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { buildThemeInitScript } from "@/lib/theme";
import "./globals.css";

/*
  Inter for UI text, Geist Mono for payload previews, per docs/DESIGN_SYSTEM.md.
  Both are self hosted through next/font with a system fallback.
  The wordmark uses "Signet" as a working placeholder until the owner
  confirms the final brand name (PRD Phase 0 gate).
*/
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signet, the honest QR code generator",
  description:
    "Free static QR codes with no signup and no watermark. Dynamic codes that never become a dead end.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildThemeInitScript() }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-text">
        {children}
      </body>
    </html>
  );
}
