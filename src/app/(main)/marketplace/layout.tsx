import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agricultural Marketplace",
  description:
    "Buy and sell farm products directly through AgriNova's agricultural marketplace in Bangladesh. Browse crops, seeds, poultry, farm foods, equipment and more.",
  keywords: [
    "AgriNova marketplace",
    "Bangladesh agriculture marketplace",
    "farm products Bangladesh",
    "buy crops online Bangladesh",
    "sell farm products",
    "agricultural marketplace",
  ],
  alternates: { canonical: "/marketplace" },
  openGraph: {
    title: "Agricultural Marketplace",
    description:
      "Discover farm products from AgriNova farmers across Bangladesh.",
    url: "/marketplace",
    siteName: "AgriNova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agricultural Marketplace",
    description: "Discover farm products from AgriNova farmers across Bangladesh.",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}