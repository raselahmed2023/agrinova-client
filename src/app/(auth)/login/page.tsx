"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Leaf } from "lucide-react";
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

    const { data: resData, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(
        error.message || "Incorrect email or password. Please try again.",
      );
    } else {
      const user = resData?.user as typeof resData.user & { status?: string };

      if (user?.status === "PENDING") {
        await authClient.signOut();
        setAuthError(
          "Your expert account is currently under review by an admin. Please wait for approval.",
        );
        return;
      }

      console.log("Login successful:", resData);
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-800">
      {/* Left Banner Section */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#043321] p-12 text-white lg:flex">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Brand Logo */}
        <Link
          href="/"
          className="relative z-10 inline-flex items-center rounded-xl bg-white px-4 py-2 shadow-sm transition hover:opacity-95 w-fit"
          title="AgriNova Home"
        >
          <Image
            src="/AgriNova-Logo.png"
            alt="AgriNova"
            width={160}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Hero Text */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
            Grow Smarter, <br />
            Farm Better.
          </h1>
          <p className="text-base font-normal leading-relaxed text-emerald-100/80">
            Join the next generation of precision agriculture. Manage your
            fields, analyze data, and connect with experts all in one
            intelligent platform.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-200/50">
          © {new Date().getFullYear()} AgriNova Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden">
            <Link href="/" className="inline-flex items-center transition hover:opacity-90" title="AgriNova Home">
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={155}
                height={46}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Auth Alert Banner */}
          {authError && (
            <div className="flex items-center gap-3 rounded-lg bg-red-100/80 p-4 text-sm text-red-800 border border-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="test@agrinova.com"
                  {...register("email")}
                  className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                    errors.password
                      ? "border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                      : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Checkbox & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#043321] focus:ring-emerald-600"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full justify-center rounded-lg bg-[#043321] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#032619] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center text-sm text-slate-600">
            {"Don't have an account?"}{" "}
            <Link
              href="/register"
              className="font-bold text-slate-900 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
