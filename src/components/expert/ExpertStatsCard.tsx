import React from "react";
import Link from "next/link";
import {
  Inbox,
  BadgeCheck,
  CalendarDays,
  Radio,
  CheckCheck,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

export interface ExpertStatItem {
  id: "requests" | "accepted" | "scheduled" | "ongoing" | "completed";
  label: string;
  count: number;
  description: string;
  icon: LucideIcon;
  href: string;
  className: string;
}

interface ExpertStatsCardsProps {
  stats: {
    newRequests?: number;
    accepted?: number;
    scheduled: number;
    ongoing: number;
    completed: number;
  };
  isLoading?: boolean;
}

export default function ExpertStatsCard({
  stats,
  isLoading = false,
}: ExpertStatsCardsProps) {
  const statItems: ExpertStatItem[] = [
    {
      id: "requests",
      label: "New Requests",
      count: stats.newRequests || 0,
      description: "Waiting for your review",
      icon: Inbox,
      href: "/dashboard/expert/requests",
      className: "text-amber-700 bg-amber-50 border-amber-200 hover:border-amber-400",
    },
    {
      id: "accepted",
      label: "Accepted",
      count: stats.accepted || 0,
      description: "Ready to schedule",
      icon: BadgeCheck,
      href: "/dashboard/expert/requests?status=ACCEPTED",
      className: "text-sky-700 bg-sky-50 border-sky-200 hover:border-sky-400",
    },
    {
      id: "scheduled",
      label: "Scheduled",
      count: stats.scheduled,
      description: "Upcoming video calls",
      icon: CalendarDays,
      href: "/dashboard/expert/consultations?status=SCHEDULED",
      className: "text-indigo-700 bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    },
    {
      id: "ongoing",
      label: "Ongoing",
      count: stats.ongoing,
      description: "Active live sessions",
      icon: Radio,
      href: "/dashboard/expert/consultations?status=ONGOING",
      className: "text-rose-700 bg-rose-50 border-rose-200 hover:border-rose-400",
    },
    {
      id: "completed",
      label: "Completed",
      count: stats.completed,
      description: "Consultations closed",
      icon: CheckCheck,
      href: "/dashboard/expert/consultations?status=COMPLETED",
      className: "text-emerald-700 bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isOngoing = item.id === "ongoing" && item.count > 0;

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${item.className}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm ring-1 ring-black/5">
                <Icon className={`h-5 w-5 ${isOngoing ? "animate-pulse" : ""}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 opacity-50 transition group-hover:opacity-100" />
            </div>

            <div className="mt-4">
              {isLoading ? (
                <div className="h-8 w-12 animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black tracking-tight text-slate-950">
                    {item.count}
                  </span>
                  {isOngoing && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                      Live
                    </span>
                  )}
                </div>
              )}

              <h3 className="mt-1 text-sm font-bold text-slate-800">
                {item.label}
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
