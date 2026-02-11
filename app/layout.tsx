import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxe Floral Design | Premium Arrangements",
  description: "Exquisite floral designs for your most memorable moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-ivory font-sans text-charcoal antialiased selection:bg-blush selection:text-burgundy",
          playfair.variable,
          inter.variable
        )}
      >
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 sm:px-6 lg:px-8 pt-[88px]">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
