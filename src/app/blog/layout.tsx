import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Agricultural Blog & Expert Farming Guides | AgriNova",
  description: "Read practical agricultural articles written by AgriNova experts, with community comments and replies from farmers and specialists.",
  keywords: ["farming blog Bangladesh", "agriculture guide", "AgriNova experts", "crop management", "smart farming"],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Agricultural Blog & Expert Farming Guides | AgriNova",
    description: "Practical farming knowledge written by agricultural experts.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-slate-50"><Navbar /><main className="flex-1">{children}</main><Footer /></div>;
}