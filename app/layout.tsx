import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { MobileTabbar } from "@/components/navigation/MobileTabbar";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { GsoroScrollFX } from "@/components/motion/GsapScrollFX";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "AURA | Brand Watches at Real Market Prices",
  description:
    "Shop the world's finest watches — Rolex, Patek Philippe, Omega, Cartier and more — with real market prices in INR.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <head>
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-white text-ink-950 font-sans antialiased lg:cursor-none">
        <SmoothScroll />
        <GsoroScrollFX />
        <CustomCursor />
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileTabbar />
      </body>
    </html>
  );
}

