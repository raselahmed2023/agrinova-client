"use client";

import {
  FormEvent,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  authClient,
} from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    sent,
    setSent,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      setError("");

      if (
        !cleanEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          cleanEmail
        )
      ) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        const redirectTo =
          `${window.location.origin}/reset-password`;

        const {
          error:
            requestError,
        } =
          await authClient.requestPasswordReset(
            {
              email:
                cleanEmail,

              redirectTo,
            }
          );

        if (
          requestError
        ) {
          
          console.error(
            "Password reset request failed:",
            requestError
          );

          setError(
            "We could not process the password reset request right now. Please try again."
          );

          return;
        }

        
        setSent(
          true
        );
      } catch (
        err
      ) {
        console.error(
          "Forgot password error:",
          err
        );

        setError(
          "We could not process the password reset request right now. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <Link
            href="/"
            className="mb-8 inline-flex"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={145}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Check your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            If an AgriNova account
            exists for{" "}
            <span className="font-semibold text-slate-900">
              {email.trim()}
            </span>
            , a password reset link
            has been sent.
          </p>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs leading-5 text-emerald-800">
              The link expires after
              60 minutes. Check your
              spam or junk folder if
              you do not see the
              message.
            </p>
          </div>

          <div className="mt-7 space-y-3">
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#063B2B] text-sm font-semibold text-white transition hover:bg-[#0B513D]"
            >
              Return to Login
            </Link>

            <button
              type="button"
              onClick={() => {
                setSent(
                  false
                );

                setError(
                  ""
                );
              }}
              className="h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 overflow-hidden bg-[#03231a] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#0b6045_0%,#03231a_55%,#021811_100%)]" />

        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

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
              Securely recover
              your account.
            </h2>

            <p className="mt-4 text-sm leading-7 text-emerald-100/75">
              Enter the email
              address associated
              with your AgriNova
              account. We will send
              a secure, time-limited
              password reset link.
            </p>
          </div>

          <p className="text-xs text-emerald-100/50">
            AgriNova Account
            Security
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
            >
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={140}
                height={42}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0B513D]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to login
          </Link>

          <div className="mt-7">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Forgot password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your account
              email and we will send
              you a password reset
              link.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <span>
                {error}
              </span>
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
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
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
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0B513D] focus:bg-white focus:ring-4 focus:ring-[#0B513D]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B513D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />

                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            For your security,
            AgriNova will not reveal
            whether an email address
            is registered.
          </p>
        </div>
      </div>
    </div>
  );
}