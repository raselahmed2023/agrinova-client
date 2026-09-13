"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertCircle,
  ArrowRight,
  Award,
  Briefcase,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import {
  expertRegisterSchema,
  ExpertRegisterInput,
} from "@/lib/validations";

import { authClient } from "@/lib/auth-client";

const DEFAULT_AVATAR = "/images/default-avatar.png";

export default function ExpertRegisterPage() {
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [authError, setAuthError] =
    useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState(DEFAULT_AVATAR);

  const [imageError, setImageError] =
    useState<string | null>(null);

  const [
    isUploadingImage,
    setIsUploadingImage,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ExpertRegisterInput>({
    resolver: zodResolver(
      expertRegisterSchema
    ) as any,

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

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setImageError(null);

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      setImageError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    if (
      imagePreview &&
      imagePreview !== DEFAULT_AVATAR
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleRemoveImage = () => {
    if (
      imagePreview &&
      imagePreview !== DEFAULT_AVATAR
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(DEFAULT_AVATAR);
    setImageError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadAvatar = async () => {
    if (!imageFile) {
      return DEFAULT_AVATAR;
    }

    setIsUploadingImage(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      formData.append(
        "purpose",
        "expert-registration"
      );

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response
          .json()
          .catch(() => null);

      if (
        !response.ok ||
        !result?.success ||
        !result?.url
      ) {
        throw new Error(
          result?.message ||
            "Unable to upload profile image."
        );
      }

      return String(result.url);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (
    data: ExpertRegisterInput
  ) => {
    setAuthError(null);
    setImageError(null);

    let avatarUrl =
      DEFAULT_AVATAR;

    try {
      avatarUrl =
        await uploadAvatar();
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Unable to upload profile image."
      );

      return;
    }

    try {
      const { error } =
        await authClient.signUp.email({
          email: data.email,
          password:
            data.password,
          name: data.name,
          phone: data.phone,
          specialization:
            data.specialization,
          experienceYears:
            Number(
              data.experienceYears
            ),
          qualification:
            data.qualification,
          image: avatarUrl,
          avatar: avatarUrl,
        } as Parameters<
          typeof authClient.signUp.email
        >[0]);

      if (error) {
        setAuthError(
          error.message ||
            "Failed to submit application. Please try again."
        );

        return;
      }

      const applicationResponse =
        await fetch(
          "/api/expert-application",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              phone:
                data.phone,

              specialization:
                data.specialization,

              experienceYears:
                Number(
                  data.experienceYears
                ),

              qualification:
                data.qualification,
            }),
          }
        );

      const applicationResult =
        await applicationResponse
          .json()
          .catch(() => null);

      if (
        !applicationResponse.ok ||
        !applicationResult?.success
      ) {
        setAuthError(
          applicationResult?.message ||
            "Your account was created, but the expert application could not be submitted. Please contact AgriNova support."
        );

        return;
      }

      await authClient.signOut();

      setIsSubmitted(true);
    } catch {
      setAuthError(
        "An unexpected error occurred. Please try again."
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-[#0B513D]" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Application Submitted
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your expert account is now under admin review.
            You can sign in after approval.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="mt-6 w-full rounded-xl bg-[#063B2B] py-3 text-sm font-semibold text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition focus:border-[#0B513D] focus:bg-white focus:ring-4 focus:ring-[#0B513D]/10";

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#03231a] p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#084c37_0%,#03231a_60%,#021811_100%)] opacity-95" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-white px-3 py-2"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={135}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold">
            Share Knowledge.
            <br />

            <span className="text-emerald-300">
              Empower Farmers.
            </span>
          </h1>

          <p className="mt-4 text-emerald-100/80">
            Join AgriNova as an agricultural specialist
            and provide professional guidance to farmers.
          </p>

          <div className="mt-8 space-y-3">
            <SideFeature
              icon={
                <Briefcase className="h-5 w-5" />
              }
              title="Expert Profile"
              text="Build a professional agricultural expert profile."
            />

            <SideFeature
              icon={
                <CalendarCheck className="h-5 w-5" />
              }
              title="Consultation"
              text="Provide guidance to farmers through AgriNova."
            />

            <SideFeature
              icon={
                <Award className="h-5 w-5" />
              }
              title="Admin Verification"
              text="Expert applications are reviewed before activation."
            />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/60">
          <ShieldCheck className="h-4 w-4" />
          Admin-verified credentials
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-lg">
          <div className="lg:hidden">
            <Link href="/">
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={130}
                height={38}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900 lg:mt-0">
            Apply as an Expert
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Submit your details to join AgriNova&apos;s expert network.
          </p>

          {authError && (
            <div className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {authError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-emerald-200 bg-white">
                  <Image
                    src={imagePreview}
                    alt="Expert avatar preview"
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Profile Picture
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WEBP · Maximum 5MB
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                    </button>

                    {imageFile && (
                      <button
                        type="button"
                        onClick={
                          handleRemoveImage
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  {imageError && (
                    <p className="mt-2 text-xs text-red-600">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <InputField
              label="Full Name"
              icon={
                <User className="h-4 w-4" />
              }
              error={
                errors.name?.message
              }
            >
              <input
                {...register("name")}
                className={inputClass}
                placeholder="Dr. Anisur Rahman"
              />
            </InputField>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Email"
                icon={
                  <Mail className="h-4 w-4" />
                }
                error={
                  errors.email?.message
                }
              >
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  placeholder="expert@example.com"
                />
              </InputField>

              <InputField
                label="Phone"
                icon={
                  <Phone className="h-4 w-4" />
                }
                error={
                  errors.phone?.message
                }
              >
                <input
                  {...register("phone")}
                  className={inputClass}
                  placeholder="01XXXXXXXXX"
                />
              </InputField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Specialization"
                icon={
                  <Briefcase className="h-4 w-4" />
                }
                error={
                  errors.specialization
                    ?.message
                }
              >
                <input
                  {...register(
                    "specialization"
                  )}
                  className={inputClass}
                  placeholder="Soil Science"
                />
              </InputField>

              <InputField
                label="Experience Years"
                icon={
                  <Clock className="h-4 w-4" />
                }
                error={
                  errors.experienceYears
                    ?.message
                }
              >
                <input
                  type="number"
                  min={1}
                  {...register(
                    "experienceYears"
                  )}
                  className={inputClass}
                />
              </InputField>
            </div>

            <InputField
              label="Qualification"
              icon={
                <GraduationCap className="h-4 w-4" />
              }
              error={
                errors.qualification
                  ?.message
              }
            >
              <input
                {...register(
                  "qualification"
                )}
                className={inputClass}
                placeholder="M.Sc in Agronomy"
              />
            </InputField>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    {...register("password")}
                    className={`${inputClass} pl-10 pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-3 top-3.5 text-slate-400"
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
                    {
                      errors.password
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    {...register(
                      "confirmPassword"
                    )}
                    className={`${inputClass} pl-10 pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-3 top-3.5 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {
                      errors
                        .confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-0.5"
              />

              <span>
                I confirm that my credentials are genuine and I
                agree to the Terms of Service.
              </span>
            </label>

            {errors.terms && (
              <p className="text-xs text-red-600">
                {errors.terms.message}
              </p>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isUploadingImage
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#063B2B] text-sm font-semibold text-white disabled:opacity-60"
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0B513D]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-3.5 text-slate-400">
          {icon}
        </div>

        <div className="[&_input]:pl-10">
          {children}
        </div>
      </div>

      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function SideFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-xs text-emerald-100/70">
          {text}
        </p>
      </div>
    </div>
  );
}