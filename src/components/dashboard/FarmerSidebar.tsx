"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  BrainCircuit,
  CloudSun,
  LayoutDashboard,
  Leaf,
  Menu,
  MessageSquareText,
  ShoppingBag,
  Store,
  Tags,
  WalletCards,
  X,
} from "lucide-react";

interface FarmerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
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
    icon: Leaf,
  },
  {
    label: "Weather",
    href: "/dashboard/farmer/weather",
    icon: CloudSun,
  },
];

const aiItems = [
  {
    label: "Disease Detection",
    href: "/dashboard/farmer/ai/disease-detection",
    icon: BrainCircuit,
  },
  {
    label: "Crop Recommendation",
    href: "/dashboard/farmer/ai/crop-recommendation",
    icon: Leaf,
  },
  {
    label: "Farming Assistant",
    href: "/dashboard/farmer/ai/assistant",
    icon: Bot,
  },
];

const marketplaceItems = [
  {
    label: "Browse",
    href: "/dashboard/farmer/marketplace",
    icon: ShoppingBag,
  },
  {
    label: "Sell Product",
    href: "/dashboard/farmer/marketplace/sell",
    icon: Store,
  },
  {
    label: "My Listings",
    href: "/dashboard/farmer/marketplace/listings",
    icon: Tags,
  },
  {
    label: "Purchase Requests",
    href: "/dashboard/farmer/marketplace/requests",
    icon: MessageSquareText,
  },
];

const otherItems = [
  {
    label: "Finance",
    href: "/dashboard/farmer/finance",
    icon: WalletCards,
  },
  {
    label: "Expert Consultation",
    href: "/dashboard/farmer/consultation",
    icon: MessageSquareText,
  },
];

export default function FarmerSidebar({
  isOpen,
  onClose,
}: FarmerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (
      href === "/dashboard/farmer" ||
      href === "/dashboard/farmer/marketplace"
    ) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderItem = (
    item: {
      label: string;
      href: string;
      icon: React.ElementType;
    }
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active
            ? "bg-[#EAF4ED] text-[#0B513D]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
      >
        <Icon
          className={`h-4.5 w-4.5 ${active
              ? "text-[#0B513D]"
              : "text-slate-400"
            }`}
        />

        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 lg:shadow-none ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/dashboard/farmer"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B513D] text-white">
              <Leaf className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                AgriNova
              </p>

              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Farmer
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map(renderItem)}
          </div>

          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              AI Tools
            </p>

            <div className="space-y-1">
              {aiItems.map(renderItem)}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Marketplace
            </p>

            <div className="space-y-1">
              {marketplaceItems.map(renderItem)}
            </div>
          </div>

          <div className="mt-6 space-y-1">
            {otherItems.map(renderItem)}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-[#F5F8F6] p-3">
            <p className="text-xs font-semibold text-[#0B513D]">
              Grow Smarter
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Manage your farm with AgriNova.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}