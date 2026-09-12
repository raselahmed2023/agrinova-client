import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Review your AgriNova marketplace orders.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}