"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  LogOut,
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
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    if (onClose) onClose();
    router.push("/");
    router.refresh();
  };

  const getInitials = (name?: string) => {
    if (!name) return "E";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

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
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 transition hover:opacity-90"
          title="AgriNova Home"
        >
          <Image
            src="/AgriNova-Logo.png"
            alt="AgriNova"
            width={140}
            height={42}
            priority
            className="h-9 w-auto object-contain"
          />
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Expert
          </span>
        </Link>

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

      {/* Bottom User Profile & Logout */}
      <div className="mt-auto border-t border-slate-200/80 bg-slate-50/70 p-3 rounded-xl">
        {isPending ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-2.5 w-28 bg-slate-200 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] text-xs font-bold text-[#063B2B] shadow-xs">
                {getInitials(user?.name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || "Expert Account"}
                </p>
                <p
                  className="truncate text-[11px] text-slate-500 leading-tight mt-0.5"
                  title={user?.email || "Signed In"}
                >
                  {user?.email || "expert@agrinova.io"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout from AgriNova"
              aria-label="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}