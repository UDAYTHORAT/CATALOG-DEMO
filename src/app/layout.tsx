import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../../Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../../Satoshi_Complete/Fonts/WEB/fonts/Satoshi-VariableItalic.ttf",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FunnelLink — Turn Visitors into WhatsApp Leads",
  description:
    "One smart link that guides visitors through a fast decision flow and sends them to WhatsApp with a clear buying message. Set up in 2 minutes.",
  keywords: [
    "WhatsApp leads",
    "sales funnel",
    "smart link",
    "lead generation",
    "WhatsApp marketing",
  ],
  openGraph: {
    title: "FunnelLink — Turn Visitors into WhatsApp Leads",
    description:
      "One smart link that guides visitors through a fast decision flow and sends them to WhatsApp with a clear buying message.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable} data-scroll-behavior="smooth">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
