"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  UserCircle,
  Video,
  X,
} from "lucide-react";

interface ExpertSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

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

export default function ExpertSidebar({
  isOpen = false,
  onClose,
}: ExpertSidebarProps) {
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

        ${
          isOpen
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
            Expert Panel
          </p>
        </div>

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
            item.href ===
            "/dashboard/expert"
              ? pathname === item.href
              : pathname.startsWith(
                  item.href
                );

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-950"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}