import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Italiana } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const italiana = Italiana({
  subsets: ["latin"],
  variable: "--font-italiana",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ESTRE FURNITURES | Premium Sofa Archive",
  description: "Experience the exclusive Ibisca Collection. Handcrafted artifacts for the modern sanctuary by Estre Furnitures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${italiana.variable}`}>
       <body className="antialiased font-sans">
        <CustomCursor />
        <Preloader />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
