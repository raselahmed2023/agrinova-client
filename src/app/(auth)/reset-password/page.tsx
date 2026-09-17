"use client";

import {
  Suspense,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

/* ============================================================
   RESET CONTENT
============================================================ */

function ResetPasswordContent() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    );

  const tokenError =
    searchParams.get(
      "error"
    );

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
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
    useState(false);

  /* ==========================================================
     TOKEN STATE
  ========================================================== */

  const invalidToken =
    useMemo(
      () =>
        !token ||
        Boolean(
          tokenError
        ),
      [
        token,
        tokenError,
      ]
    );

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        loading ||
        invalidToken ||
        !token
      ) {
        return;
      }

      setError(
        ""
      );

      if (
        password.length <
        8
      ) {
        setError(
          "Password must contain at least 8 characters."
        );

        return;
      }

      if (
        password.length >
        128
      ) {
        setError(
          "Password cannot exceed 128 characters."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      try {
        setLoading(
          true
        );

        const {
          error:
            resetError,
        } =
          await authClient
            .resetPassword(
              {
                newPassword:
                  password,

                token,
              }
            );

        if (
          resetError
        ) {
          console.error(
            "Password reset error:",
            resetError
          );

          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );

          return;
        }

        setPassword(
          ""
        );

        setConfirmPassword(
          ""
        );

        setSuccess(
          true
        );
      } catch (
        resetError
      ) {
        console.error(
          "Password reset failed:",
          resetError
        );

        setError(
          "Unable to reset the password. Please request a new reset link."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ==========================================================
     SUCCESS
  ========================================================== */

  if (
    success
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

        <div className="w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">

          <Link
            href="/"
            className="mx-auto flex w-fit items-center rounded-xl border border-slate-100 px-3 py-1.5 shadow-sm"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={
                135
              }
              height={
                40
              }
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">

            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Password changed
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your AgriNova password has been
            reset successfully. For security,
            your previous sessions have also
            been revoked.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063b2b] text-sm font-black text-white transition hover:bg-[#0b513d]"
          >
            Sign in with new password

            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     INVALID / EXPIRED TOKEN
  ========================================================== */

  if (
    invalidToken
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

        <div className="w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

            <XCircle className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Reset link unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This password reset link is
            invalid or has expired. Request
            a new link to continue.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063b2b] text-sm font-black text-white"
          >
            <KeyRound className="h-4 w-4" />

            Request New Reset Link
          </Link>

          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />

            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  /* ==========================================================
     RESET FORM
  ========================================================== */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

      <div className="w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">

        <Link
          href="/"
          className="flex w-fit items-center rounded-xl border border-slate-100 px-3 py-1.5 shadow-sm"
        >
          <Image
            src="/AgriNova-Logo.png"
            alt="AgriNova"
            width={
              135
            }
            height={
              40
            }
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="mt-7">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

            <LockKeyhole className="h-5 w-5" />
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
            Create new password
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a new password for your
            AgriNova account.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6 space-y-4"
        >

          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="text-xs font-black text-slate-700"
            >
              New Password
            </label>

            <div className="relative mt-2">

              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                required
                minLength={
                  8
                }
                maxLength={
                  128
                }
                value={
                  password
                }
                onChange={(
                  event
                ) => {
                  setPassword(
                    event.target.value
                  );

                  if (
                    error
                  ) {
                    setError(
                      ""
                    );
                  }
                }}
                placeholder="At least 8 characters"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm outline-none transition focus:border-[#07583f] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="text-xs font-black text-slate-700"
            >
              Confirm New Password
            </label>

            <div className="relative mt-2">

              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                required
                minLength={
                  8
                }
                maxLength={
                  128
                }
                value={
                  confirmPassword
                }
                onChange={(
                  event
                ) => {
                  setConfirmPassword(
                    event.target.value
                  );

                  if (
                    error
                  ) {
                    setError(
                      ""
                    );
                  }
                }}
                placeholder="Repeat new password"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm outline-none transition focus:border-[#07583f] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3">

            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

            <p className="text-[10px] leading-5 text-slate-500">
              Use at least 8 characters.
              After the reset, existing
              account sessions will be
              revoked.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading
            }
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063b2b] text-sm font-black text-white transition hover:bg-[#0b513d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Resetting...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />

                Reset Password
              </>
            )}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-5 flex items-center justify-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          Back to sign in
        </Link>
      </div>
    </main>
  );
}

/* ============================================================
   PAGE
============================================================ */

function ResetPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6]">

      <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <ResetPageLoading />
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}