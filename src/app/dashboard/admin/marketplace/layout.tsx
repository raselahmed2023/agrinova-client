import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace Operations",
  description: "Admin marketplace moderation and fulfillment operations.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}