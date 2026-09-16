"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

type ResetLinkState =
  | "CHECKING"
  | "VALID"
  | "INVALID";

export default function ResetPasswordPage() {
  const [
    token,
    setToken,
  ] =
    useState("");

  const [
    linkState,
    setLinkState,
  ] =
    useState<ResetLinkState>(
      "CHECKING"
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
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const resetError =
      params.get(
        "error"
      );

    const resetToken =
      params.get(
        "token"
      );

    if (
      resetError ||
      !resetToken
    ) {
      setLinkState(
        "INVALID"
      );

      return;
    }

    setToken(
      resetToken
    );

    setLinkState(
      "VALID"
    );
  }, []);

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setError("");

      if (!token) {
        setLinkState(
          "INVALID"
        );

        return;
      }

      if (
        password.length <
        6
      ) {
        setError(
          "Password must contain at least 6 characters."
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
        setSubmitting(
          true
        );

        const {
          error:
            resetError,
        } =
          await authClient.resetPassword(
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
            "Password reset failed:",
            resetError
          );

          setLinkState(
            "INVALID"
          );

          return;
        }

        setSuccess(
          true
        );

        setPassword(
          ""
        );

        setConfirmPassword(
          ""
        );
      } catch (
        err
      ) {
        console.error(
          "Password reset error:",
          err
        );

        setError(
          "Unable to reset your password. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  if (
    linkState ===
    "CHECKING"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0B513D]" />

          <p className="mt-3 text-sm text-slate-500">
            Checking reset
            link...
          </p>
        </div>
      </div>
    );
  }

  if (
    success
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Image
            src="/AgriNova-Logo.png"
            alt="AgriNova"
            width={145}
            height={42}
            priority
            className="mx-auto h-9 w-auto object-contain"
          />

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Password updated
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your AgriNova
            password has been
            changed successfully.
            For security, your old
            sessions have also been
            revoked.
          </p>

          <Link
            href="/login"
            className="mt-7 flex h-11 w-full items-center justify-center rounded-xl bg-[#063B2B] text-sm font-semibold text-white transition hover:bg-[#0B513D]"
          >
            Sign In With New Password
          </Link>
        </div>
      </div>
    );
  }

  if (
    linkState ===
    "INVALID"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Image
            src="/AgriNova-Logo.png"
            alt="AgriNova"
            width={145}
            height={42}
            priority
            className="mx-auto h-9 w-auto object-contain"
          />

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Reset link is invalid
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This password reset
            link is invalid, has
            already been used, or
            has expired.
          </p>

          <Link
            href="/forgot-password"
            className="mt-7 flex h-11 w-full items-center justify-center rounded-xl bg-[#063B2B] text-sm font-semibold text-white transition hover:bg-[#0B513D]"
          >
            Request New Reset Link
          </Link>

          <Link
            href="/login"
            className="mt-3 block text-sm font-semibold text-slate-500 hover:text-[#0B513D]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 overflow-hidden bg-[#03231a] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0b6045_0%,#03231a_58%,#021811_100%)]" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link
            href="/"
            className="inline-flex w-fit rounded-xl bg-white px-3 py-2"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={140}
              height={42}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="max-w-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white">
              Create a new
              password.
            </h2>

            <p className="mt-4 text-sm leading-7 text-emerald-100/75">
              Choose a password
              that you have not
              used for this
              account before.
            </p>
          </div>

          <p className="text-xs text-emerald-100/50">
            Secure password
            recovery
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={140}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0B513D]">
            <KeyRound className="h-5 w-5" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            Reset password
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter your new
            AgriNova account
            password below.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              {error}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                New Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={128}
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm outline-none transition focus:border-[#0B513D] focus:bg-white focus:ring-4 focus:ring-[#0B513D]/10"
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

              <p className="mt-1.5 text-xs text-slate-400">
                Minimum 6
                characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={128}
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Re-enter new password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm outline-none transition focus:border-[#0B513D] focus:bg-white focus:ring-4 focus:ring-[#0B513D]/10"
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
                      ? "Hide confirm password"
                      : "Show confirm password"
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

            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] text-sm font-semibold text-white transition hover:bg-[#0B513D] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Updating...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />

                  Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}