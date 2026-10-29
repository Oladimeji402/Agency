import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.agency.name} — Software development studio`,
  description: siteConfig.agency.description,
  openGraph: {
    title: siteConfig.agency.name,
    description: siteConfig.agency.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#101113",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${mono.variable}`}>
      {/* Browser extensions (e.g. ColorZilla) inject attributes on <body> before hydration. */}
      <body suppressHydrationWarning className="surface-dark bg-surface text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
