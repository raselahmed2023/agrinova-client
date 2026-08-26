"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Bot,
  BrainCircuit,
  ChevronDown,
  CloudSun,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageSquareText,
  PackageSearch,
  PlusCircle,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Sprout,
  Store,
  WalletCards,
  X,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";

interface FarmerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const simpleLinks = [
  {
    label: "Dashboard",
    href: "/dashboard/farmer",
    icon: LayoutDashboard,
  },
  {
    label: "Notifications",
    href: "/dashboard/farmer/notifications",
    icon: Bell,
  },
  {
    label: "My Farms",
    href: "/dashboard/farmer/farms",
    icon: Sprout,
  },
  {
    label: "Weather",
    href: "/dashboard/farmer/weather",
    icon: CloudSun,
  },
];

const aiLinks = [
  {
    label: "Disease Detection",
    href: "/dashboard/farmer/ai/disease-detection",
    icon: Leaf,
  },
  {
    label: "Crop Recommendation",
    href: "/dashboard/farmer/ai/crop-recommendation",
    icon: Sparkles,
  },
  {
    label: "Farming Assistant",
    href: "/dashboard/farmer/ai/assistant",
    icon: Bot,
  },
];

const marketplaceLinks = [
  {
    label: "Browse",
    href: "/dashboard/farmer/marketplace",
    icon: Store,
  },
  {
    label: "Sell Product",
    href: "/dashboard/farmer/marketplace/sell-product",
    icon: PlusCircle,
  },
  {
    label: "My Listings",
    href: "/dashboard/farmer/marketplace/my-listings",
    icon: ShoppingBag,
  },
  {
    label: "Purchase Requests",
    href: "/dashboard/farmer/marketplace/purchase-requests",
    icon: PackageSearch,
  },
];

export default function FarmerSidebar({
  isOpen = true,
  onClose,
}: FarmerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [aiOpen, setAiOpen] = useState(
    pathname.startsWith("/dashboard/farmer/ai")
  );

  const [marketplaceOpen, setMarketplaceOpen] = useState(
    pathname.startsWith("/dashboard/farmer/marketplace")
  );

  const isActive = (href: string) => {
    if (href === "/dashboard/farmer") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const linkClasses = (href: string) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive(href)
        ? "bg-[#E8F3EC] text-[#0B513D]"
        : "text-slate-600 hover:bg-slate-100 hover:text-[#0B513D]"
    }`;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-72 flex-col
        border-r border-slate-200 bg-white
        transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B513D] text-white">
            <Leaf className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#063B2B]">AgriNova</h2>
            <p className="text-xs text-slate-500">Farmer Dashboard</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-1">
          {simpleLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={linkClasses(item.href)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* AI Tools */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setAiOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              pathname.startsWith("/dashboard/farmer/ai")
                ? "bg-[#F0F7F3] text-[#0B513D]"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <BrainCircuit className="h-5 w-5" />
              AI Tools
            </span>

            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                aiOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {aiOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {aiLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={linkClasses(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Marketplace */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setMarketplaceOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              pathname.startsWith("/dashboard/farmer/marketplace")
                ? "bg-[#F0F7F3] text-[#0B513D]"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Store className="h-5 w-5" />
              Marketplace
            </span>

            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                marketplaceOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {marketplaceOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {marketplaceLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={linkClasses(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom main links */}
        <div className="mt-6 space-y-1 border-t border-slate-100 pt-5">
          <Link
            href="/dashboard/farmer/finance"
            onClick={onClose}
            className={linkClasses("/dashboard/farmer/finance")}
          >
            <WalletCards className="h-5 w-5" />
            <span>Finance</span>
          </Link>

          <Link
            href="/dashboard/farmer/consultation"
            onClick={onClose}
            className={linkClasses("/dashboard/farmer/consultation")}
          >
            <MessageSquareText className="h-5 w-5" />
            <span>Expert Consultation</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>

        <div className="mt-4 rounded-xl bg-[#F4F8F5] p-3">
          <p className="text-xs font-medium text-[#315B45]">
            Grow Smarter, Farm Better
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            Smart tools for better farming decisions.
          </p>
        </div>
      </div>
    </aside>
  );
}