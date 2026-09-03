"use client";

import { useEffect, useState, FormEvent, startTransition } from "react";
import { adminUserService } from "@/services/admin.user.service";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IUsersResponse {
  success: boolean;
  data: UserItem[];
  meta?: PaginationMeta;
}

interface IActionResponse {
  success: boolean;
  message?: string;
}

export default function AdminUsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchUsers = async (targetPage: number = page, currentRole = roleFilter, currentStatus = statusFilter, currentSearch = search) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("page", targetPage.toString());
      query.append("limit", limit.toString());
      if (currentSearch) query.append("search", currentSearch);
      if (currentRole) query.append("role", currentRole);
      if (currentStatus) query.append("status", currentStatus);

      const response = await adminUserService.getUsers(query.toString());
      const res = response as IUsersResponse;
      if (res && res.success) {
        setUsers(res.data);
        if (res.meta) {
          setMeta(res.meta);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when filters change, resetting page to 1 safely using startTransition
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
    fetchUsers(1, roleFilter, statusFilter, search);
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      setPage(1);
    });
    fetchUsers(1, roleFilter, statusFilter, search);
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      let response: unknown;
      if (currentStatus === "BLOCKED") {
        response = await adminUserService.unblockUser(userId);
      } else {
        response = await adminUserService.blockUser(userId);
      }
      const res = response as IActionResponse;
      if (res && !res.success) {
        alert(res.message || "Action failed");
      } else {
        fetchUsers(page);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert(error.message || "Action failed");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
      fetchUsers(newPage);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500">Monitor and manage platform users, roles, and account accessibility.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
          />
        </form>

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="FARMER">Farmer</option>
            <option value="EXPERT">Expert</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading user profiles...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{user.name}</td>
                    <td className="py-3.5 px-6 text-slate-500">{user.email}</td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === "APPROVED" || user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <Link
                        href={`/dashboard/admin/users/${user._id}`}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        View
                      </Link>
                      {user.role !== "ADMIN" && (
                        <button
                          onClick={() => toggleUserStatus(user._id, user.status)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg transition ${
                            user.status === "BLOCKED"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          }`}
                        >
                          {user.status === "BLOCKED" ? "Unblock" : "Block"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No users found matching criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-sm text-slate-500">
            <div>
              Showing page <span className="font-semibold text-slate-700">{meta.page}</span> of{" "}
              <span className="font-semibold text-slate-700">{meta.totalPages}</span> ({meta.total} total users)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= meta.totalPages}
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