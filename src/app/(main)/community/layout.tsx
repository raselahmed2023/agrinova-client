import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farmer Community | AgriNova",
  description:
    "Read real farm updates, questions, discussions, and experiences shared by the AgriNova farming community.",
  keywords: [
    "AgriNova community",
    "farmer community Bangladesh",
    "agriculture discussion",
    "farmer posts",
    "farming network",
  ],
  alternates: { canonical: "/community" },
  openGraph: {
    title: "Farmer Community | AgriNova",
    description:
      "Explore farm updates and conversations from the AgriNova farmer community.",
    url: "/community",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmer Community | AgriNova",
    description:
      "Explore farm updates and conversations from the AgriNova farmer community.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children;
}