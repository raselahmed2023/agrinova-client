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
} from "lucide-react";

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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 px-3">
        <h2 className="text-xl font-bold text-emerald-950">
          AgriNova
        </h2>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-950 text-white"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-950"
              }`}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}