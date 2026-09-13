"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  adminUserService,
} from "@/services/admin.user.service";

interface AdminProfileForm {
  name: string;

  phone: string;

  email: string;

  role: string;

  status: string;
}

const emptyProfile: AdminProfileForm =
  {
    name: "",

    phone: "",

    email: "",

    role:
      "ADMIN",

    status:
      "APPROVED",
  };

export default function AdminSettingsPage() {
  const [
    profile,
    setProfile,
  ] =
    useState<AdminProfileForm>(
      emptyProfile
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const loadProfile =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const result =
          await adminUserService.getAdminProfile();

        setProfile({
          name:
            result.name ||
            "",

          phone:
            result.phone ||
            "",

          email:
            result.email ||
            "",

          role:
            result.role ||
            "ADMIN",

          status:
            result.status ||
            "APPROVED",
        });
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Admin profile."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleUpdate =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanName =
        profile.name.trim();

      if (
        cleanName.length <
        2
      ) {
        setError(
          "Full name must contain at least 2 characters."
        );

        return;
      }

      try {
        setSaving(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        /*
         * Only name + phone are submitted.
         *
         * email / role / status are NEVER sent
         * from this Settings screen.
         */
        const result =
          await adminUserService.updateAdminProfile(
            {
              name:
                cleanName,

              phone:
                profile.phone.trim(),
            }
          );

        setProfile(
          (
            current
          ) => ({
            ...current,

            name:
              result.name ||
              cleanName,

            phone:
              result.phone ||
              "",

            email:
              result.email ||
              current.email,

            role:
              result.role ||
              current.role,

            status:
              result.status ||
              current.status,
          })
        );

        setSuccess(
          "Admin profile updated successfully."
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update Admin profile."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-400">
        Loading Admin
        settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Admin Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update your basic
          Admin profile
          information.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          {success}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold text-slate-900">
              Administrator
              Account
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {profile.role} ·{" "}
              {profile.status}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={
          handleUpdate
        }
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Mail className="h-3.5 w-3.5" />

            Email Address
          </label>

          <input
            type="email"
            value={
              profile.email
            }
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Email cannot be
            changed from Admin
            Settings.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <UserRound className="h-3.5 w-3.5" />

            Full Name
          </label>

          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={
              profile.name
            }
            onChange={(
              event
            ) => {
              setSuccess(
                ""
              );

              setProfile(
                (
                  current
                ) => ({
                  ...current,

                  name:
                    event.target
                      .value,
                })
              );
            }}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Phone className="h-3.5 w-3.5" />

            Phone Number
          </label>

          <input
            type="text"
            maxLength={30}
            value={
              profile.phone
            }
            onChange={(
              event
            ) => {
              setSuccess(
                ""
              );

              setProfile(
                (
                  current
                ) => ({
                  ...current,

                  phone:
                    event.target
                      .value,
                })
              );
            }}
            placeholder="Optional phone number"
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-800">
            For security,
            this form cannot
            change your email,
            ADMIN role, account
            status, password or
            authentication
            permissions.
          </p>
        </div>

        <button
          type="submit"
          disabled={
            saving
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}