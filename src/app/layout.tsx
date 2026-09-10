import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "AgriNova",
  description:
    "Smart Agriculture & Digital Farming Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}