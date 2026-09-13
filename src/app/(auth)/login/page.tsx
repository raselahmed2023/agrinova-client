"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sprout,
  Users,
  Store,
} from "lucide-react";

import { loginSchema, LoginInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

function getRequestedRedirect(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  const raw =
    params.get("redirect") ||
    params.get("callbackUrl");

  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return null;
  }

  try {
    const url = new URL(raw, window.location.origin);

    if (url.origin !== window.location.origin) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setAuthError(null);

    try {
      const { data: resData, error } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

      if (error) {
        setAuthError(
          error.message ||
            "Incorrect email or password. Please try again."
        );
        return;
      }

      const user = resData?.user as
        | (typeof resData.user & {
            status?: string;
            role?: string;
          })
        | undefined;

      const accountStatus = String(
        user?.status || "APPROVED"
      ).toUpperCase();

      if (accountStatus === "PENDING") {
        await authClient.signOut();

        setAuthError(
          "Your expert account is currently under review by an admin. Please wait for approval."
        );
        return;
      }

      if (accountStatus === "REJECTED") {
        await authClient.signOut();

        setAuthError(
          "Your expert application was not approved. Please contact AgriNova support if you need more information."
        );
        return;
      }

      if (accountStatus === "BLOCKED") {
        await authClient.signOut();

        setAuthError(
          "This account has been blocked by an administrator. Please contact AgriNova support."
        );
        return;
      }

      const role = String(user?.role || "FARMER").toUpperCase();
      const requestedRedirect = getRequestedRedirect();

      let destination = "/dashboard/farmer";

      if (role === "ADMIN") {
        destination =
          requestedRedirect?.startsWith("/dashboard/admin")
            ? requestedRedirect
            : "/dashboard/admin";
      } else if (role === "EXPERT") {
        destination =
          requestedRedirect?.startsWith("/dashboard/expert")
            ? requestedRedirect
            : "/dashboard/expert";
      } else {
        const invalidFarmerRedirect =
          requestedRedirect?.startsWith("/dashboard/admin") ||
          requestedRedirect?.startsWith("/dashboard/expert");

        if (requestedRedirect && !invalidFarmerRedirect) {
          destination = requestedRedirect;
        }
      }

      router.replace(destination);
      router.refresh();
    } catch {
      setAuthError(
        "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#03231a] p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#084c37_0%,#03231a_60%,#021811_100%)] opacity-95" />

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-sm"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={135}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-300">
            Smart Agriculture
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6 py-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
              Grow More.
              <br />
              <span className="text-emerald-300">
                Manage Better.
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-emerald-100/80 xl:text-base">
              Real-time crop data, easy farm management, and expert
              advice in one simple platform.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Feature
              icon={<Sprout className="h-5 w-5" />}
              title="Field & Crop Monitoring"
              description="Track weather, soil conditions, and crop health alerts."
            />

            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Expert Consultations"
              description="Book direct sessions with verified agricultural specialists."
            />

            <Feature
              icon={<Store className="h-5 w-5" />}
              title="Direct Marketplace"
              description="Sell your harvest directly to buyers at fair prices."
            />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Secure AgriNova Account
          </span>

          <span>© {new Date().getFullYear()} AgriNova</span>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center overflow-y-auto px-4 py-8 sm:px-8 md:px-12 lg:w-1/2 lg:px-12 xl:px-20">
        <div className="mx-auto my-auto w-full max-w-md space-y-6">
          <div className="flex items-center justify-between pb-2 lg:hidden">
            <Link href="/">
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={130}
                height={38}
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to your AgriNova account to continue.
            </p>
          </div>

          {authError && (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {authError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none focus:border-[#0B513D]"
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1 flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#0B513D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 text-sm outline-none focus:border-[#0B513D]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3.5 top-3.5 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] text-sm font-semibold text-white hover:bg-[#0B513D] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center text-xs">
            <p>
              New to AgriNova?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#0B513D]"
              >
                Create farmer account
              </Link>
            </p>

            <p className="mt-3">
              Agricultural specialist?{" "}
              <Link
                href="/register/expert"
                className="font-semibold text-[#0B513D]"
              >
                Join as Expert →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>

        <p className="mt-0.5 text-xs text-emerald-200/70">
          {description}
        </p>
      </div>
    </div>
  );
}