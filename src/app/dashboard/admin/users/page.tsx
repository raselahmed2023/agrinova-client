"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  adminUserService,
  type AdminUser,
  type AdminUserMeta,
} from "@/services/admin.user.service";

const PAGE_SIZE = 10;

const statusStyle = (
  status: string
) => {
  switch (
    status.toUpperCase()
  ) {
    case "APPROVED":
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "BLOCKED":
      return "bg-rose-50 text-rose-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const roleStyle = (
  role: string
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

export default function AdminUsersManagementPage() {
  const [
    users,
    setUsers,
  ] =
    useState<
      AdminUser[]
    >([]);

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

  const [
    actionId,
    setActionId,
  ] =
    useState<
      string | null
    >(null);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    appliedSearch,
    setAppliedSearch,
  ] =
    useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState("");

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    meta,
    setMeta,
  ] =
    useState<AdminUserMeta>(
      {
        page: 1,
        limit:
          PAGE_SIZE,
        total: 0,
        totalPages: 1,
      }
    );

  const fetchUsers =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const query =
            new URLSearchParams();

          query.set(
            "page",
            String(page)
          );

          query.set(
            "limit",
            String(
              PAGE_SIZE
            )
          );

          if (
            appliedSearch
          ) {
            query.set(
              "search",
              appliedSearch
            );
          }

          if (
            roleFilter
          ) {
            query.set(
              "role",
              roleFilter
            );
          }

          if (
            statusFilter
          ) {
            query.set(
              "status",
              statusFilter
            );
          }

          const result =
            await adminUserService.getUsers(
              query.toString()
            );

          setUsers(
            result.data
          );

          setMeta(
            result.meta
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load users."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        appliedSearch,
        roleFilter,
        statusFilter,
      ]
    );

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const applySearch =
    (
      event:
        FormEvent
    ) => {
      event.preventDefault();

      setPage(1);

      setAppliedSearch(
        search.trim()
      );
    };

  const changeRole =
    (
      value:
        string
    ) => {
      setPage(1);

      setRoleFilter(
        value
      );
    };

  const changeStatus =
    (
      value:
        string
    ) => {
      setPage(1);

      setStatusFilter(
        value
      );
    };

  const toggleUserStatus =
    async (
      user:
        AdminUser
    ) => {
      if (
        user.role ===
        "ADMIN"
      ) {
        return;
      }

      const blocking =
        user.status !==
        "BLOCKED";

      if (
        blocking &&
        !window.confirm(
          `Block ${user.name}? They will immediately lose access to protected AgriNova features.`
        )
      ) {
        return;
      }

      try {
        setActionId(
          user._id
        );

        setError("");

        if (
          user.status ===
          "BLOCKED"
        ) {
          await adminUserService.unblockUser(
            user._id
          );
        } else {
          await adminUserService.blockUser(
            user._id
          );
        }

        await fetchUsers();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to update user."
        );
      } finally {
        setActionId(
          null
        );
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor platform
            accounts and control
            account access.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void fetchUsers()
          }
          disabled={
            loading
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <form
            onSubmit={
              applySearch
            }
            className="relative flex-1"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              placeholder="Search name or email..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-24 text-sm outline-none focus:border-emerald-500"
            />

            <button
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white"
            >
              Search
            </button>
          </form>

          <select
            value={
              roleFilter
            }
            onChange={(
              event
            ) =>
              changeRole(
                event.target
                  .value
              )
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            <option value="">
              All Roles
            </option>

            <option value="FARMER">
              Farmer
            </option>

            <option value="EXPERT">
              Expert
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              changeStatus(
                event.target
                  .value
              )
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            <option value="">
              All Statuses
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="BLOCKED">
              Blocked
            </option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">
                  User
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

                <th className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading user
                    profiles...
                  </td>
                </tr>
              ) : users.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(
                  (
                    user
                  ) => (
                    <tr
                      key={
                        user._id
                      }
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {
                            user.name
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {
                            user.email
                          }
                        </p>
                      </td>

                      <td className="px-6 py-4">
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

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            user.status
                          )}`}
                        >
                          {
                            user.status
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/admin/users/${user._id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            <Eye className="h-3.5 w-3.5" />

                            View
                          </Link>

                          {user.role !==
                            "ADMIN" && (
                            <button
                              type="button"
                              disabled={
                                actionId ===
                                user._id
                              }
                              onClick={() =>
                                void toggleUserStatus(
                                  user
                                )
                              }
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${
                                user.status ===
                                "BLOCKED"
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              {user.status ===
                              "BLOCKED" ? (
                                <>
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban className="h-3.5 w-3.5" />
                                  Block
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {meta.total} total
            users · Page{" "}
            {meta.page} of{" "}
            {meta.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page <= 1 ||
                loading
              }
              onClick={() =>
                setPage(
                  (
                    current
                  ) =>
                    Math.max(
                      current -
                        1,
                      1
                    )
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />

              Previous
            </button>

            <button
              type="button"
              disabled={
                page >=
                  meta.totalPages ||
                loading
              }
              onClick={() =>
                setPage(
                  (
                    current
                  ) =>
                    Math.min(
                      current +
                        1,

                      meta.totalPages
                    )
                )
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"
            >
              Next

              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}