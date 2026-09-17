"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

/* ============================================================
   PAGE
============================================================ */

export default function ForgotPasswordPage() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    submitted,
    setSubmitted,
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
    cooldown,
    setCooldown,
  ] =
    useState(0);

  /* ==========================================================
     RESEND COUNTDOWN
  ========================================================== */

  useEffect(() => {
    if (
      cooldown <=
      0
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setCooldown(
            (
              current
            ) =>
              Math.max(
                current -
                  1,
                0
              )
          );
        },
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    cooldown,
  ]);

  /* ==========================================================
     SEND RESET LINK
  ========================================================== */

  const sendResetLink =
    async () => {
      const normalizedEmail =
        email
          .trim()
          .toLowerCase();

      if (
        !normalizedEmail
      ) {
        setError(
          "Enter your email address."
        );

        return false;
      }

      const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        );

      if (
        !validEmail
      ) {
        setError(
          "Enter a valid email address."
        );

        return false;
      }

      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const {
          error:
            authError,
        } =
          await authClient
            .requestPasswordReset(
              {
                email:
                  normalizedEmail,

                redirectTo:
                  `${window.location.origin}/reset-password`,
              }
            );

        if (
          authError
        ) {
          console.error(
            "Password reset request error:",
            authError
          );

          setError(
            "We could not process the request right now. Please try again."
          );

          return false;
        }

        setSubmitted(
          true
        );

        setCooldown(
          60
        );

        return true;
      } catch (
        requestError
      ) {
        console.error(
          "Password reset request failed:",
          requestError
        );

        setError(
          "We could not process the request right now. Please try again."
        );

        return false;
      } finally {
        setLoading(
          false
        );
      }
    };

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
        loading
      ) {
        return;
      }

      await sendResetLink();
    };

  /* ==========================================================
     RESEND
  ========================================================== */

  const handleResend =
    async () => {
      if (
        loading ||
        cooldown >
          0
      ) {
        return;
      }

      await sendResetLink();
    };

  /* ==========================================================
     SUCCESS VIEW
  ========================================================== */

  if (
    submitted
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

        <div className="w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">

          <Link
            href="/"
            className="mx-auto flex w-fit items-center justify-center rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-sm"
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

          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">

            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="mt-5 text-center">

            <h1 className="text-2xl font-black tracking-tight text-slate-950">
              Check your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              If an AgriNova account exists
              for
            </p>

            <p className="mt-1 break-all text-sm font-black text-[#07583f]">
              {email
                .trim()
                .toLowerCase()}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              you will receive a password
              reset link shortly.
            </p>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

            <p className="text-xs leading-5 text-amber-800">
              The reset link expires after
              60 minutes. Also check your
              spam or junk folder.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={
              loading ||
              cooldown >
                0
            }
            onClick={() =>
              void handleResend()
            }
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Sending...
              </>
            ) : cooldown >
              0 ? (
              <>
                <Clock3 className="h-4 w-4" />

                Resend in{" "}
                {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />

                Resend reset link
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmitted(
                false
              );

              setCooldown(
                0
              );

              setError(
                ""
              );
            }}
            className="mt-3 w-full text-center text-xs font-black text-emerald-700 hover:underline"
          >
            Use a different email
          </button>

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

  /* ==========================================================
     FORM
  ========================================================== */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-4 py-8">

      <div className="w-full max-w-[470px] rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">

        <Link
          href="/"
          className="flex w-fit items-center rounded-xl border border-slate-100 bg-white px-3 py-1.5 shadow-sm"
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

            <Mail className="h-5 w-5" />
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the email associated
            with your AgriNova account.
            We&apos;ll send you a secure
            password reset link.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6"
        >

          <label
            htmlFor="email"
            className="text-xs font-black text-slate-700"
          >
            Email Address
          </label>

          <div className="relative mt-2">

            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={
                email
              }
              onChange={(
                event
              ) => {
                setEmail(
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
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#07583f] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
            />
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading
            }
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063b2b] px-4 text-sm font-black text-white transition hover:bg-[#0b513d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Sending...
              </>
            ) : (
              <>
                Send Reset Link

                <Mail className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-3">

          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

          <p className="text-[10px] leading-5 text-slate-500">
            For security, the same response
            is shown whether or not an
            account exists for the email.
          </p>
        </div>

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