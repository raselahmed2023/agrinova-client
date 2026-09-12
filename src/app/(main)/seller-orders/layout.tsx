import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Orders",
  description: "Manage your marketplace seller fulfillments.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}