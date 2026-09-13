import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Marketplace Listings",
  description: "Manage your marketplace listings.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
