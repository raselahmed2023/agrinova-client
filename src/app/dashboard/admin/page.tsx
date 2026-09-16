"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  FileText,
  LucideIcon,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Tractor,
  UserCheck,
  Users,
} from "lucide-react";

import {
  adminService,
  type AdminDashboardData,
} from "@/services/admin.service";

const statusStyle =
  (
    status:
      string
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "REJECTED":
        return "bg-rose-50 text-rose-700";

      case "BLOCKED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

const roleStyle =
  (
    role:
      string
  ) => {
    switch (
      role.toUpperCase()
    ) {
      case "ADMIN":
        return "bg-violet-50 text-violet-700";

      case "EXPERT":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-emerald-50 text-emerald-700";
    }
  };

export default function AdminDashboardPage() {
  const [
    stats,
    setStats,
  ] =
    useState<
      AdminDashboardData | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadDashboard =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const result =
          await adminService.getDashboard();

        setStats(
          result
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Admin Dashboard."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void loadDashboard();
  }, []);

  if (
    loading &&
    !stats
  ) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Loading dashboard
          overview...
        </div>
      </div>
    );
  }

  const recentUsers =
    stats?.recentUsers ||
    [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Platform Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor users,
            Expert approvals,
            farms, marketplace
            listings and
            consultations.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadDashboard()
          }
          disabled={
            loading
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Farmers"
          value={
            stats?.totalFarmers ||
            0
          }
          icon={
            Users
          }
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Experts"
          value={
            stats?.totalExperts ||
            0
          }
          icon={
            UserCheck
          }
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Approvals"
          value={
            stats?.pendingExpertApprovals ||
            0
          }
          icon={
            ShieldAlert
          }
          color="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Total Farms"
          value={
            stats?.totalFarms ||
            0
          }
          icon={
            Tractor
          }
          color="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Live Listings"
          value={
            stats?.activeListings ||
            0
          }
          icon={
            ShoppingBag
          }
          color="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Consultations"
          value={
            stats?.totalConsultations ||
            0
          }
          icon={
            FileText
          }
          color="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Latest Users
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Most recent 5
              accounts created on
              AgriNova.
            </p>
          </div>

          <Link
            href="/dashboard/admin/users"
            className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            View All Users
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3">
                  Name
                </th>

                <th className="px-6 py-3">
                  Email
                </th>

                <th className="px-6 py-3">
                  Role
                </th>

                <th className="px-6 py-3">
                  Status
                </th>

                <th className="px-6 py-3">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentUsers.length >
              0 ? (
                recentUsers.map(
                  (
                    user
                  ) => (
                    <tr
                      key={
                        user._id
                      }
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-3.5 font-medium text-slate-800">
                        {
                          user.name
                        }
                      </td>

                      <td className="px-6 py-3.5 text-slate-500">
                        {
                          user.email
                        }
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyle(
                            user.role
                          )}`}
                        >
                          {
                            user.role
                          }
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            user.status ||
                              "APPROVED"
                          )}`}
                        >
                          {user.status ||
                            "APPROVED"}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-xs text-slate-500">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No users
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title:
    string;

  value:
    number | string;

  icon:
    LucideIcon;

  color:
    string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}