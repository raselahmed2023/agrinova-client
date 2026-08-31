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
  ArrowLeft,
  Stethoscope,
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
      <div className="mb-6 flex items-start justify-between px-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-white font-bold">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-950 leading-tight">
              AgriNova
            </h2>
            <p className="text-[11px] font-semibold text-emerald-700">
              Expert Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-1">
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
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-950"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="pt-4 border-t border-slate-100 space-y-1 px-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Main Site</span>
        </Link>
      </div>
    </aside>
  );
}