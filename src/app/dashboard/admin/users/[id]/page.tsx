"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Ban,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
} from "lucide-react";

import {
  adminUserService,
  type AdminUser,
} from "@/services/admin.user.service";

export default function UserDetailsPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const userId =
    params.id;

  const [
    user,
    setUser,
  ] =
    useState<
      AdminUser | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    async () => {
      try {
        setLoading(
          true
        );

        setError("");

        const result =
          await adminUserService.getUserById(
            userId
          );

        setUser(
          result
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to load user."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    if (userId) {
      void load();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleStatus =
    async () => {
      if (
        !user ||
        user.role ===
          "ADMIN"
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        setError("");

        const updated =
          user.status ===
          "BLOCKED"
            ? await adminUserService.unblockUser(
                user._id
              )
            : await adminUserService.blockUser(
                user._id
              );

        setUser(
          updated
        );
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
        setActionLoading(
          false
        );
      }
    };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm font-medium text-slate-500">
        Loading user
        details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          {error ||
            "User not found."}
        </p>

        <button
          onClick={() =>
            router.back()
          }
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <button
        onClick={() =>
          router.back()
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Users
      </button>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl font-bold text-emerald-700">
              {user.name
                ?.charAt(0)
                .toUpperCase() ||
                "U"}
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {user.name}
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />

                {user.email}
              </p>
            </div>
          </div>

          {user.role !==
            "ADMIN" && (
            <button
              type="button"
              disabled={
                actionLoading
              }
              onClick={() =>
                void toggleStatus()
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50 ${
                user.status ===
                "BLOCKED"
                  ? "bg-emerald-700 text-white hover:bg-emerald-800"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {user.status ===
              "BLOCKED" ? (
                <>
                  <ShieldCheck className="h-4 w-4" />

                  Unblock Account
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />

                  Block Account
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            label="Role"
            value={
              user.role
            }
            icon={
              <Shield className="h-4 w-4" />
            }
          />

          <Info
            label="Status"
            value={
              user.status
            }
            icon={
              user.status ===
              "BLOCKED" ? (
                <Ban className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )
            }
          />

          <Info
            label="Phone"
            value={
              user.phone ||
              "Not provided"
            }
            icon={
              <Phone className="h-4 w-4" />
            }
          />

          <Info
            label="Email Verified"
            value={
              user.emailVerified
                ? "Yes"
                : "No"
            }
          />

          <Info
            label="Created"
            value={
              user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleString()
                : "N/A"
            }
            icon={
              <Calendar className="h-4 w-4" />
            }
          />

          <Info
            label="Last Updated"
            value={
              user.updatedAt
                ? new Date(
                    user.updatedAt
                  ).toLocaleString()
                : "N/A"
            }
            icon={
              <Calendar className="h-4 w-4" />
            }
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            User ID
          </p>

          <p className="mt-1 break-all font-mono text-sm text-slate-700">
            {user._id ||
              user.id}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        {icon}

        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}