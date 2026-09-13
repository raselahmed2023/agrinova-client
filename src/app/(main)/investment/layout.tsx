import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farm Investment Projects | AgriNova",
  description: "Explore Admin-reviewed agricultural funding projects from verified AgriNova farmers across Bangladesh.",
  keywords: ["farm investment", "agriculture investment Bangladesh", "AgriNova investment", "farmer funding"],
  alternates: { canonical: "/investment" },
  openGraph: {
    title: "Farm Investment Projects | AgriNova",
    description: "Discover agricultural projects seeking funding through AgriNova.",
    type: "website",
    url: "/investment",
  },
};

export default function InvestmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}