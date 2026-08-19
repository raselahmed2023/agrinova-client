"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Leaf,
  Briefcase,
  Award,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { expertRegisterSchema, ExpertRegisterInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

export default function ExpertRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // useForm<ExpertRegisterInput
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expertRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      experienceYears: 1,
      qualification: "",
      terms: false,
    },
  });

  
  const onSubmit = async (data: ExpertRegisterInput) => {
    setAuthError(null);

    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        role: "EXPERT",
        status: "PENDING",
        phone: data.phone,
        specialization: data.specialization,
        experienceYears: Number(data.experienceYears),
        qualification: data.qualification,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        setAuthError(
          error.message || "Failed to submit application. Please try again."
        );
      } else {
        await authClient.signOut();
        setIsSubmitted(true);
      }
    } catch (err) {
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  // Success State (When application is submitted)
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Application Submitted!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Thank you for applying as an Agricultural Expert. Your profile is
              currently under review by our Admin team. You will be notified once
              approved.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-lg bg-[#043321] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#032619] transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-800">
      {/* Left Banner Section */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#043321] p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-2.5 text-2xl font-bold tracking-tight">
          <Leaf className="h-7 w-7 text-emerald-400 fill-emerald-400/20" />
          <span>AgriNova</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
            Share Your Expertise, <br />
            Empower Farmers.
          </h1>
          <p className="text-base font-normal leading-relaxed text-emerald-100/80">
            Become a verified expert on AgriNova. Offer actionable insights,
            help solve agricultural challenges, and drive modern precision farming forward.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-emerald-200/50">
          © {new Date().getFullYear()} AgriNova Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 overflow-y-auto">
        <div className="w-full max-w-lg space-y-7 my-auto py-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Apply as an Expert 🌾
            </h2>
            <p className="text-sm text-slate-500">
              Fill out your details to join our agricultural expert network.
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name & Phone Number */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Dr. Anisur Rahman"
                    {...register("name")}
                    className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="01700000000"
                    {...register("phone")}
                    className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="expert@agrinova.com"
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

            {/* Expert Professional Section */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#043321]">
                Professional Profile
              </h3>

              {/* Specialization */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Specialization / Field
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Pest Control, Soil Health, Agronomy"
                    {...register("specialization")}
                    className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                      errors.specialization
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    }`}
                  />
                </div>
                {errors.specialization && (
                  <p className="text-xs text-red-500">
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              {/* Experience Years & Qualification */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Years of Experience
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="5"
                      {...register("experienceYears", { valueAsNumber: true })}
                      className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                        errors.experienceYears
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      }`}
                    />
                  </div>
                  {errors.experienceYears && (
                    <p className="text-xs text-red-500">
                      {errors.experienceYears.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Highest Qualification
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. B.Sc in Agriculture"
                      {...register("qualification")}
                      className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                        errors.qualification
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      }`}
                    />
                  </div>
                  {errors.qualification && (
                    <p className="text-xs text-red-500">
                      {errors.qualification.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#043321] focus:ring-emerald-600"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to AgriNova&apos;s{" "}
                  <span className="font-semibold text-slate-900 hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-slate-900 hover:underline">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500">{errors.terms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full justify-center rounded-lg bg-[#043321] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#032619] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Expert Application"}
            </button>
          </form>

          {/* Nav Links */}
          <div className="space-y-2 text-center text-xs text-slate-600">
            <p>
              Are you a general farmer?{" "}
              <Link
                href="/register"
                className="font-bold text-slate-900 hover:underline"
              >
                Register as Farmer
              </Link>
            </p>
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-slate-900 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}