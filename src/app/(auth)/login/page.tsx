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
      const { data: resData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(
          error.message || "Incorrect email or password. Please try again."
        );
      } else {
        const user = resData?.user as (typeof resData)["user"] & {
          status?: string;
          role?: string;
        };

        if (user?.status === "PENDING") {
          await authClient.signOut();
          setAuthError(
            "Your expert account is currently under review by an admin. Please wait for approval."
          );
          return;
        }

        router.push("/");
        router.refresh();
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Brand Showcase Panel (Desktop) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#03231a] p-10 text-white lg:flex xl:p-14">
        {/* Subtle Background Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#084c37_0%,#03231a_60%,#021811_100%)] opacity-95" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-sm transition hover:opacity-95"
            title="AgriNova Home"
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

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6 py-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight">
              Grow More. <br />
              <span className="text-emerald-300">Manage Better.</span>
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed xl:text-base">
              Real-time crop data, easy farm management, and expert advice in
              one simple platform.
            </p>
          </div>

          {/* Simple Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Field & Crop Monitoring
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Track weather, soil conditions, and crop health alerts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Expert Consultations
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Book direct sessions with verified agricultural specialists.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Direct Marketplace
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Sell your harvest directly to buyers at fair prices.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Metric Bar */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/40 p-3 text-center">
            <div>
              <p className="text-lg font-bold text-white">50k+</p>
              <p className="text-[11px] text-emerald-300/80">Active Farmers</p>
            </div>
            <div className="border-x border-emerald-500/20">
              <p className="text-lg font-bold text-white">98%</p>
              <p className="text-[11px] text-emerald-300/80">Accuracy</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">24/7</p>
              <p className="text-[11px] text-emerald-300/80">Advisory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Protected by 256-bit encryption
          </span>
          <span>© {new Date().getFullYear()} AgriNova</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex w-full flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:w-1/2 lg:px-12 xl:px-20 overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-6 my-auto">
          {/* Mobile Header Logo */}
          <div className="flex items-center justify-between lg:hidden pb-2">
            <Link
              href="/"
              className="inline-flex items-center"
              title="AgriNova Home"
            >
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={130}
                height={38}
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-[#0B513D]">
              Sign In
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to your AgriNova account to continue.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-snug">{authError}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
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
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-11 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-[#063B2B] focus:ring-[#063B2B]"
                />
                <span className="text-xs font-medium text-slate-600">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B513D] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Simple Registration Switchers */}
          <div className="pt-2 border-t border-slate-100 space-y-3 text-center text-xs">
            <p className="text-slate-600">
              New to AgriNova?{" "}
              <Link
                href="/register"
                className="font-semibold text-slate-900 hover:text-[#0B513D] hover:underline"
              >
                Create farmer account
              </Link>
            </p>

            <p className="text-slate-500">
              Are you an agricultural specialist?{" "}
              <Link
                href="/register/expert"
                className="font-semibold text-[#0B513D] hover:underline"
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
