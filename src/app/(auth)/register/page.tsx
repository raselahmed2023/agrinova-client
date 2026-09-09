"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sprout,
  Store,
  Users,
} from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setAuthError(null);

    try {
      const { data: resData, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        setAuthError(
          error.message || "Failed to create account. Please try again."
        );
      } else {
        router.push("/dashboard");
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
            Farmer Registration
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6 py-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight">
              Smart Tools for <br />
              <span className="text-emerald-300">Modern Farming.</span>
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed xl:text-base">
              Track your fields, monitor crop growth, and connect directly with
              trusted buyers.
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
                  Field Management
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Record planting dates, fertilizer inputs, and harvest schedules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Direct Marketplace
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Connect with buyers and sell produce without middlemen fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Expert Support
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Get quick, reliable answers for pest control and soil health.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/40 p-3.5">
            <p className="text-xs font-bold text-white">
              Trusted by 50,000+ Farmers
            </p>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">
              Active across 64 districts in Bangladesh
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Free farmer account
          </span>
          <span>© {new Date().getFullYear()} AgriNova</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex w-full flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:w-1/2 lg:px-12 xl:px-20 overflow-y-auto">
        <div className="mx-auto w-full max-w-md space-y-5 my-auto py-2">
          {/* Mobile Header Logo */}
          <div className="flex items-center justify-between lg:hidden pb-1">
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
              Farmer Sign Up
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Your Account
            </h1>
            <p className="text-sm text-slate-500">
              Enter your details to get started with AgriNova.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-snug">{authError}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  {...register("name")}
                  className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    {...register("phone")}
                    className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    {...register("password")}
                    className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-10 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700"
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

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    {...register("confirmPassword")}
                    className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-10 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#063B2B] focus:ring-[#063B2B]"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-medium text-slate-900 underline hover:text-[#0B513D]"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-medium text-slate-900 underline hover:text-[#0B513D]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B513D] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-slate-600 pt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 hover:text-[#0B513D] hover:underline"
            >
              Sign In
            </Link>
          </div>

          {/* Simple Expert Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Are you an agricultural specialist?
              </p>
              <p className="text-[11px] text-slate-500">
                Join our network to provide consultations.
              </p>
            </div>
            <Link
              href="/register/expert"
              className="shrink-0 rounded-lg bg-[#D8E9DA] px-3 py-1.5 text-xs font-semibold text-[#063B2B] hover:bg-[#c9dfcb] transition"
            >
              Apply as Expert →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}