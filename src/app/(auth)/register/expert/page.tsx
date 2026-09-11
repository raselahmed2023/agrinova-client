"use client";

import React, { useState, useRef } from "react";
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
  Briefcase,
  Award,
  GraduationCap,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import { expertRegisterSchema, ExpertRegisterInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

const DEFAULT_AVATAR = "/images/default-avatar.png";

export default function ExpertRegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Profile Picture Upload State (Same flow as Expert Profile update section)
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpertRegisterInput>({
    resolver: zodResolver(expertRegisterSchema) as any,
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

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setAvatarUrl(data.url);
        } else {
          setImageError(data.message || "Failed to upload image.");
        }
      } else {
        setImageError("Server failed to upload image.");
      }
    } catch (err: any) {
      setImageError(err?.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setAvatarUrl("");
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ExpertRegisterInput) => {
    setAuthError(null);

    const finalAvatar = avatarUrl || DEFAULT_AVATAR;

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
        image: finalAvatar,
        avatar: finalAvatar,
      } as Parameters<typeof authClient.signUp.email>[0]);

      if (error) {
        setAuthError(
          error.message || "Failed to submit application. Please try again."
        );
      } else {
        await authClient.signOut();
        setIsSubmitted(true);
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    }
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-md space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#063B2B]">
            <CheckCircle2 className="h-9 w-9 text-[#0B513D]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Application Submitted
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Thank you for applying to join AgriNova. Our team is reviewing
              your credentials. You will be able to log in once approved.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">Next Steps:</p>
            <p>1. Our admin verifies your educational background and field.</p>
            <p>2. Once verified, your status will be set to Active.</p>
            <p>3. You can then log in, set your availability, and meet farmers.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex-1 rounded-xl bg-[#063B2B] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
            >
              Go to Login
            </button>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Expert Network
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-6 py-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight">
              Share Knowledge. <br />
              <span className="text-emerald-300">Empower Farmers.</span>
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed xl:text-base">
              Join our verified specialist network to advise farmers, host
              consultations, and help agriculture thrive.
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Flexible Schedule
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Set your own consultation hours and consultation fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Video & Chat Consultations
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Meet farmers remotely and provide prescription guides.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Verified Specialist Profile
                </h2>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Build credibility and showcase your agricultural background.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Admin-verified credentials
          </span>
          <span>© {new Date().getFullYear()} AgriNova</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex w-full flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:w-1/2 lg:px-12 xl:px-20 overflow-y-auto">
        <div className="mx-auto w-full max-w-lg space-y-5 my-auto py-2">
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
              Expert Application
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Apply as an Expert
            </h1>
            <p className="text-sm text-slate-500">
              Submit your details to join our agricultural specialist network.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 leading-snug">{authError}</div>
            </div>
          )}

          {/* Expert Application Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Profile Picture Upload Section */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-500/40 bg-white shadow-sm ring-4 ring-emerald-50 flex items-center justify-center">
                    <Image
                      src={avatarUrl || DEFAULT_AVATAR}
                      alt="Expert avatar preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile photo"
                    title="Upload or change photo"
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#063B2B] text-white shadow-sm transition hover:bg-[#0B513D] active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Info & Action Buttons */}
                <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Profile Picture
                    </p>
                    {avatarUrl ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-[#063B2B]">
                        Custom Photo
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Default Avatar
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    Upload a clear photo (JPG, PNG, max 5MB). If skipped, our default avatar will be saved.
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" />
                      <span>
                        {isUploadingImage
                          ? "Uploading..."
                          : avatarUrl
                          ? "Change Photo"
                          : "Upload Photo"}
                      </span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {imageError && (
                    <p className="text-xs text-red-600 font-medium pt-0.5">
                      {imageError}
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    placeholder="Dr. Anisur Rahman"
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

            {/* Email Address */}
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
                  placeholder="you@institution.edu or email"
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

            {/* Specialization and Experience Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2 space-y-1">
                <label
                  htmlFor="specialization"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Specialization
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <input
                    id="specialization"
                    type="text"
                    placeholder="e.g. Soil Science, Pest Control"
                    {...register("specialization")}
                    className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                      errors.specialization
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                    }`}
                  />
                </div>
                {errors.specialization && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="experienceYears"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Experience
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <input
                    id="experienceYears"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Years (e.g. 5)"
                    {...register("experienceYears")}
                    className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                      errors.experienceYears
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                    }`}
                  />
                </div>
                {errors.experienceYears && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.experienceYears.message}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Qualification */}
            <div className="space-y-1">
              <label
                htmlFor="qualification"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Highest Qualification
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <input
                  id="qualification"
                  type="text"
                  placeholder="e.g. M.Sc in Agronomy (BAU)"
                  {...register("qualification")}
                  className={`block h-11 w-full rounded-xl border bg-slate-50/50 pl-10 pr-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none ${
                    errors.qualification
                      ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-[#0B513D] focus:ring-4 focus:ring-[#0B513D]/10 hover:border-slate-300"
                  }`}
                />
              </div>
              {errors.qualification && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.qualification.message}
                </p>
              )}
            </div>

            {/* Password & Confirm Grid */}
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
                  and confirm that my credentials are genuine.
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
              disabled={isSubmitting || isUploadingImage}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B513D] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading photo...</span>
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting application...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick links */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div>
              Already an expert?{" "}
              <Link
                href="/login"
                className="font-semibold text-slate-900 hover:text-[#0B513D] hover:underline"
              >
                Sign In
              </Link>
            </div>

            <Link
              href="/register"
              className="font-semibold text-[#0B513D] hover:underline"
            >
              Register as Farmer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}