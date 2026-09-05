"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Users, UserCheck, ShieldAlert, Tractor, ShoppingBag, FileText, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface RecentUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

interface DashboardStats {
  totalFarmers: number;
  totalExperts: number;
  pendingExpertApprovals: number;
  totalFarms: number;
  activeListings: number;
  totalConsultations: number;
  recentUsers: RecentUser[];
}

interface IDashboardResponse {
  success?: boolean;
  data?: DashboardStats;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination states for recent users table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // প্রতি পেজে কয়টি করে ইউজার দেখাবে

  useEffect(() => {
    adminService
      .getDashboard()
      .then((response: unknown) => {
        const res = response as IDashboardResponse;
        if (res && res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err: unknown) => console.error("Failed to load dashboard stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading dashboard overview...</div>
      </div>
    );
  }

  // Calculate pagination data for recent users
  const recentUsers = stats?.recentUsers || [];
  const totalPages = Math.ceil(recentUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = recentUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
        <p className="text-sm text-slate-500">Monitor overall statistics, pending expert applications, and recent activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Farmers" value={stats?.totalFarmers || 0} icon={Users} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Total Experts" value={stats?.totalExperts || 0} icon={UserCheck} color="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Approvals" value={stats?.pendingExpertApprovals || 0} icon={ShieldAlert} color="bg-amber-50 text-amber-600" />
        <StatCard title="Total Farms" value={stats?.totalFarms || 0} icon={Tractor} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Active Listings" value={stats?.activeListings || 0} icon={ShoppingBag} color="bg-purple-50 text-purple-600" />
        <StatCard title="Consultations" value={stats?.totalConsultations || 0} icon={FileText} color="bg-rose-50 text-rose-600" />
      </div>

      {/* Recent Users Section with Pagination */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent Users</h2>
          <span className="text-xs text-slate-400 font-medium">Showing {recentUsers.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, recentUsers.length)} of {recentUsers.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{user.name}</td>
                    <td className="py-3.5 px-6 text-slate-500">{user.email}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN" ? "bg-purple-50 text-purple-700" :
                        user.role === "EXPERT" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : 
                        user.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {user.status || "ACTIVE"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-sm text-slate-500">
            <div>
              Page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}