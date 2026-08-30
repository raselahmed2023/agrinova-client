"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  UserCircle,
  Video,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard/expert",
    icon: LayoutDashboard,
  },
  {
    label: "Consultation Requests",
    href: "/dashboard/expert/requests",
    icon: ClipboardList,
  },
  {
    label: "My Consultations",
    href: "/dashboard/expert/consultations",
    icon: Video,
  },
  {
    label: "Profile",
    href: "/dashboard/expert/profile",
    icon: UserCircle,
  },
  {
    label: "Availability",
    href: "/dashboard/expert/availability",
    icon: CalendarCheck,
  },
];

export default function ExpertSidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 px-3">
        <h2 className="text-xl font-bold text-emerald-950">
          AgriNova
        </h2>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Expert Panel
        </p>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/dashboard/expert"
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