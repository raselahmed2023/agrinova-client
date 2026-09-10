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
  Leaf,
  ArrowRight,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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

    const { data: resData, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message || "Failed to create account. Please try again.");
    } else {
      console.log("Registration successful:", resData);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-800">
      {/* Left Hero Panel */}
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

        {/* Hero Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
            Start Your Smarter <br />
            Farming Journey
          </h1>
          <p className="text-base font-normal leading-relaxed text-emerald-100/80">
            Join our network of forward-thinking agricultural professionals.
            Access marketplace insights, connect with experts, and optimize your operations.
          </p>
        </div>

        {/* Social Proof Widget at Bottom */}
        <div className="relative z-10 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 p-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#043321] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="User 1"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#043321] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="User 2"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#043321] object-cover"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                alt="User 3"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Join 10,000+ professionals
              </p>
              <p className="text-xs text-emerald-200/70">Growing together daily</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
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
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500">
              Enter your details to get started.
            </p>
          </div>

          {/* Auth Banner Error */}
          {authError && (
            <div className="flex items-center gap-3 rounded-lg bg-red-100/80 p-4 text-sm text-red-800 border border-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`block w-full rounded-lg border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={`block w-full rounded-lg border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  {...register("phone")}
                  className={`block w-full rounded-lg border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
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
                  className={`block w-full rounded-lg border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`block w-full rounded-lg border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#043321] focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-slate-900 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-slate-900 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#043321] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#032619] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:opacity-50 transition-all"
            >
              <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Bottom Nav Links */}
          <div className="space-y-4 pt-2 text-center text-xs text-slate-600">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-slate-900 hover:underline">
                Login
              </Link>
            </p>

            <div className="border-t border-slate-100 pt-4">
              <p>
                Are you an agricultural expert?{" "}
                <Link
                  href="/register/expert"
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:underline"
                >
                  Apply as an Expert <ExternalLink className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}