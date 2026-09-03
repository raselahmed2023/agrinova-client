import React from "react";
import {
  FileQuestion,
  CheckCircle2,
  CalendarDays,
  Radio,
  CheckCheck,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export interface ExpertStatItem {
  id: "newRequests" | "accepted" | "scheduled" | "ongoing" | "completed";
  label: string;
  count: number;
  description: string;
  icon: LucideIcon;
  href: string;
  colorScheme: {
    iconBg: string;
    iconText: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    accentGlow: string;
  };
}

interface ExpertStatsCardsProps {
  stats: {
    newRequests: number;
    accepted: number;
    scheduled: number;
    ongoing: number;
    completed: number;
  };
  isLoading?: boolean;
}

export default function ExpertStatsCard({ stats, isLoading = false }: ExpertStatsCardsProps) {
  const statItems: ExpertStatItem[] = [
    {
      id: "newRequests",
      label: "New Requests",
      count: stats.newRequests,
      description: "Pending review & approval",
      icon: FileQuestion,
      href: "/dashboard/expert/requests",
      colorScheme: {
        iconBg: "bg-amber-500/10",
        iconText: "text-amber-600",
        borderHover: "hover:border-amber-400/80",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        accentGlow: "from-amber-500/5 to-transparent",
      },
    },
    {
      id: "accepted",
      label: "Accepted",
      count: stats.accepted,
      description: "Awaiting time slot booking",
      icon: CheckCircle2,
      href: "/dashboard/expert/consultations?status=ACCEPTED",
      colorScheme: {
        iconBg: "bg-sky-500/10",
        iconText: "text-sky-600",
        borderHover: "hover:border-sky-400/80",
        badgeBg: "bg-sky-50",
        badgeText: "text-sky-700",
        accentGlow: "from-sky-500/5 to-transparent",
      },
    },
    {
      id: "scheduled",
      label: "Scheduled",
      count: stats.scheduled,
      description: "Upcoming video calls",
      icon: CalendarDays,
      href: "/dashboard/expert/consultations?status=SCHEDULED",
      colorScheme: {
        iconBg: "bg-indigo-500/10",
        iconText: "text-indigo-600",
        borderHover: "hover:border-indigo-400/80",
        badgeBg: "bg-indigo-50",
        badgeText: "text-indigo-700",
        accentGlow: "from-indigo-500/5 to-transparent",
      },
    },
    {
      id: "ongoing",
      label: "Ongoing",
      count: stats.ongoing,
      description: "Active live sessions",
      icon: Radio,
      href: "/dashboard/expert/consultations?status=ONGOING",
      colorScheme: {
        iconBg: "bg-rose-500/10",
        iconText: "text-rose-600",
        borderHover: "hover:border-rose-400/80",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-700",
        accentGlow: "from-rose-500/5 to-transparent",
      },
    },
    {
      id: "completed",
      label: "Completed",
      count: stats.completed,
      description: "Consultations closed",
      icon: CheckCheck,
      href: "/dashboard/expert/consultations?status=COMPLETED",
      colorScheme: {
        iconBg: "bg-emerald-500/10",
        iconText: "text-emerald-600",
        borderHover: "hover:border-emerald-400/80",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        accentGlow: "from-emerald-500/5 to-transparent",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isOngoing = item.id === "ongoing" && item.count > 0;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${item.colorScheme.borderHover}`}
          >
            {/* Subtle Gradient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.colorScheme.accentGlow} opacity-70 transition-opacity group-hover:opacity-100 pointer-events-none`}
            />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.colorScheme.iconBg} ${item.colorScheme.iconText} transition-transform group-hover:scale-105`}
                >
                  <Icon className={`h-5 w-5 ${isOngoing ? "animate-pulse" : ""}`} />
                </div>
                <span className="text-slate-400 group-hover:text-slate-700 transition">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  {isLoading ? (
                    <div className="h-8 w-12 bg-slate-200 animate-pulse rounded-lg" />
                  ) : (
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {item.count}
                    </span>
                  )}
                  {isOngoing && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 animate-pulse">
                      Live
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-slate-700">
                  {item.label}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
