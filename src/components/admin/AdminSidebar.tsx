"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  LayoutDashboard,
  Leaf,
  MessageSquareText,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
  Warehouse,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Expert Approval",
    href: "/dashboard/admin/expert-approval",
    icon: ShieldCheck,
  },
  {
    label: "Farms",
    href: "/dashboard/admin/farms",
    icon: Leaf,
  },
  {
    label: "Marketplace",
    href: "/dashboard/admin/marketplace",
    icon: ShoppingBag,
  },
  {
    label: "Supply Chain",
    href: "/dashboard/admin/supply-chain",
    icon: Warehouse,
  },
  {
    label: "Consultations",
    href: "/dashboard/admin/consultations",
    icon: MessageSquareText,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen w-72 flex-col
        border-r border-slate-200
        bg-white
        px-4 py-6
        shadow-xl
        transition-transform duration-300 ease-in-out

        lg:sticky lg:top-0
        lg:w-64
        lg:translate-x-0
        lg:shadow-none

        ${isOpen
          ? "translate-x-0"
          : "-translate-x-full"
        }
      `}
    >
      {/* Header */}
      <div className="mb-8 flex items-start justify-between px-3">
        <div>
          <h2 className="text-xl font-bold text-emerald-950">
            AgriNova
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Admin Panel
          </p>
        </div>

        {/* Mobile Close */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard/admin"
              ? pathname === item.href
              : pathname.startsWith(
                item.href
              );

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-950"
                }`}
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}