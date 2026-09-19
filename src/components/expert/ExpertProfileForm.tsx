"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Save,
  Check,
  X,
  Star,
  ShieldCheck,
  Lock,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import type { ExpertProfile } from "@/types/expert";
import {
  getStoredLocalImage,
  listStoredLocalImages,
  removeStoredLocalImage,
  retryStoredImage,
  uploadImageWithFallback,
  type StoredLocalImage,
} from "@/lib/image-storage";

interface ExpertProfileFormProps {
  initialProfile: ExpertProfile;
  onSave: (updated: Partial<ExpertProfile>) => Promise<void> | void;
}

const DEFAULT_CONSULTATION_FEE = 500;
const MAX_SPECIALIZATIONS = 20;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const normalizeSpecializations = (
  value: unknown
): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, MAX_SPECIALIZATIONS);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_SPECIALIZATIONS);
  }

  return [];
};

const sanitizeProfile = (
  profile: ExpertProfile
): ExpertProfile => ({
  ...profile,

  specialization: normalizeSpecializations(
    profile.specialization as unknown
  ),

  consultationFee:
    typeof profile.consultationFee === "number" &&
    Number.isFinite(profile.consultationFee) &&
    profile.consultationFee > 0
      ? profile.consultationFee
      : DEFAULT_CONSULTATION_FEE,
});

export default function ExpertProfileForm({
  initialProfile,
  onSave,
}: ExpertProfileFormProps) {
  const [profile, setProfile] = useState<ExpertProfile>(() => sanitizeProfile(initialProfile));
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setProfile(sanitizeProfile(initialProfile));
  }, [initialProfile]);

  // Picture upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localAvatar, setLocalAvatar] = useState<StoredLocalImage | null>(null);

  const imageStoragePurpose = `expert-profile-${
    initialProfile.userId || initialProfile.id || initialProfile._id || "current"
  }`;

  useEffect(() => {
    const saved = listStoredLocalImages(imageStoragePurpose);

    if (saved.length === 0) {
      setLocalAvatar(null);
      return;
    }

    const newest = saved[saved.length - 1];

    for (const item of saved) {
      if (item.localKey !== newest.localKey) {
        removeStoredLocalImage(item.localKey);
      }
    }

    setLocalAvatar(newest);
  }, [imageStoragePurpose]);

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file || isUploadingImage || isSaving) return;

    setUploadError(null);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("Profile photo must be 8 MB or smaller.");
      return;
    }

    setIsUploadingImage(true);

    try {
      const result = await uploadImageWithFallback(file, {
        purpose: imageStoragePurpose,
        allowLocalFallback: true,
      });

      if (result.source === "remote") {
        if (localAvatar) {
          removeStoredLocalImage(localAvatar.localKey);
        }

        setLocalAvatar(null);
        setProfile((prev) => ({
          ...prev,
          avatar: result.url,
        }));

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("expert-profile-updated", {
              detail: { avatar: result.url },
            })
          );
        }

        return;
      }

      const stored = getStoredLocalImage(result.localKey);

      if (!stored) {
        throw new Error(
          "The profile photo was saved locally but could not be restored."
        );
      }

      const existing = listStoredLocalImages(imageStoragePurpose);
      for (const item of existing) {
        if (item.localKey !== stored.localKey) {
          removeStoredLocalImage(item.localKey);
        }
      }

      setLocalAvatar(stored);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to process image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const retryLocalAvatar = async () => {
    if (!localAvatar || isUploadingImage || isSaving) return;

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const remoteUrl = await retryStoredImage(localAvatar.localKey);

      setLocalAvatar(null);
      setProfile((prev) => ({
        ...prev,
        avatar: remoteUrl,
      }));

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("expert-profile-updated", {
            detail: { avatar: remoteUrl },
          })
        );
      }
    } catch (err: any) {
      setUploadError(
        err?.message || "Image service is still unavailable. Please try again."
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const discardLocalAvatar = () => {
    if (localAvatar) {
      removeStoredLocalImage(localAvatar.localKey);
    }
    setLocalAvatar(null);
    setUploadError(null);
  };

  const handleRemoveImage = () => {
    discardLocalAvatar();
    setProfile((prev) => ({ ...prev, avatar: "" }));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("expert-profile-updated", {
          detail: { avatar: "" },
        })
      );
    }
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();

    if (!trimmed) {
      return;
    }

    if (profile.specialization.includes(trimmed)) {
      setErrorMessage("That specialization is already listed.");
      return;
    }

    if (profile.specialization.length >= MAX_SPECIALIZATIONS) {
      setErrorMessage(
        `You can add up to ${MAX_SPECIALIZATIONS} specializations.`
      );
      return;
    }

    setErrorMessage(null);

    setProfile((prev) => ({
      ...prev,
      specialization: [...prev.specialization, trimmed],
    }));

    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setProfile((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUploadError(null);

    const cleanName = profile.name?.trim() || "";
    const cleanTitle = profile.title?.trim() || "";
    const cleanPhone = profile.phone?.trim() || "";
    const fee = Number(profile.consultationFee);
    const experience = Number(profile.experienceYears ?? 0);

    if (cleanName.length < 2) {
      setErrorMessage("Full name must be at least 2 characters.");
      return;
    }

    if (cleanTitle.length < 2) {
      setErrorMessage("Professional title must be at least 2 characters.");
      return;
    }

    if (cleanPhone && !/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMessage("Enter a valid Bangladeshi phone number.");
      return;
    }

    if (!Number.isFinite(fee) || fee <= 0) {
      setErrorMessage("Consultation fee must be greater than 0.");
      return;
    }

    if (
      !Number.isFinite(experience) ||
      !Number.isInteger(experience) ||
      experience < 0 ||
      experience > 80
    ) {
      setErrorMessage("Experience years must be a whole number from 0 to 80.");
      return;
    }

    setIsSaving(true);

    try {
      let avatarForSave = profile.avatar || "";

      if (localAvatar) {
        setIsUploadingImage(true);

        try {
          avatarForSave = await retryStoredImage(localAvatar.localKey);
          setLocalAvatar(null);
          setProfile((prev) => ({
            ...prev,
            avatar: avatarForSave,
          }));
        } catch (err: any) {
          throw new Error(
            err?.message ||
              "Your profile photo is saved locally, but the image service is still unavailable. Please retry before saving."
          );
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Exclude email from payload so it remains untouched.
      const profileForSave = {
        ...profile,
        name: cleanName,
        title: cleanTitle,
        phone: cleanPhone,
        consultationFee: fee,
        experienceYears: experience,
        avatar: avatarForSave,
      };
      const { email, ...payloadToUpdate } = profileForSave;

      await onSave(payloadToUpdate);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("expert-profile-updated", {
            detail: { avatar: avatarForSave },
          })
        );
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const displayedAvatar = localAvatar?.dataUrl || profile.avatar || "";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl space-y-6 pb-8">
      {/* Top Banner Card: Expert Identity & Current Stats */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.07)] sm:p-6 lg:p-8">
        <div className="rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-4 sm:p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-emerald-100 border-2 border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-900 text-2xl shadow-inner">
              {displayedAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayedAvatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-emerald-700" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-slate-900">
                  {profile.name || "Expert"}
                </h3>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Specialist
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                {profile.title || "Agricultural Expert"}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ৳{profile.consultationFee ?? 500} / session
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {profile.rating ?? 0} ({profile.ratingCount ?? 0} reviews)
                </span>
                <span>·</span>
                <span>{profile.totalConsultations || 0} Consultations Completed</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Dr. Anisur Rahman"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Title / Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Professional Title / Designation *
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={120}
              value={profile.title || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Senior Agronomist & Soil Specialist"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Email (Read-Only) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                <Lock className="h-3 w-3" />
                Read-Only
              </span>
            </div>
            <div className="relative">
              <input
                type="email"
                disabled
                readOnly
                value={profile.email}
                className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-3 px-4 text-sm text-slate-500 cursor-not-allowed font-medium shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Registered email associated with your Better Auth account.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={11}
              pattern="01[3-9][0-9]{8}"
              value={profile.phone || ""}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");

                setProfile((prev) => ({
                  ...prev,
                  phone: digitsOnly.slice(0, 11),
                }));

                setErrorMessage(null);
              }}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Consultation Fee Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Consultation Fee (BDT / ৳) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                ৳
              </span>
              <input
                type="number"
                min={1}
                max={50000}
                step={50}
                required
                value={profile.consultationFee ?? 500}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setProfile((prev) => ({
                    ...prev,
                    consultationFee: Number.isFinite(value) ? value : 0,
                  }));

                  setErrorMessage(null);
                }}
                placeholder="500"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-9 pr-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your advisory rate charged to farmers per booked video consultation session.
            </p>
          </div>

          {/* Picture Uploadable Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Picture
            </label>

            <div
              className={`flex items-center gap-4 rounded-2xl border p-3 bg-slate-50/50 ${
                localAvatar ? "border-amber-300" : "border-slate-200"
              }`}
            >
              <div className="relative h-14 w-14 shrink-0 rounded-xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-800 text-lg shadow-inner">
                {displayedAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedAvatar}
                    alt={profile.name || "Profile Picture"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-7 w-7 text-emerald-600" />
                )}

                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}

                {localAvatar && !isUploadingImage && (
                  <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                    <CloudOff className="h-2.5 w-2.5" />
                    Local
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingImage || isSaving}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-950 transition disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploadingImage
                      ? "Processing..."
                      : displayedAvatar
                      ? "Change Photo"
                      : "Upload Photo"}
                  </button>

                  {localAvatar ? (
                    <>
                      <button
                        type="button"
                        disabled={isUploadingImage || isSaving}
                        onClick={() => void retryLocalAvatar()}
                        className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition disabled:opacity-50"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </button>

                      <button
                        type="button"
                        disabled={isUploadingImage || isSaving}
                        onClick={discardLocalAvatar}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Discard New Photo
                      </button>
                    </>
                  ) : (
                    profile.avatar && (
                      <button
                        type="button"
                        disabled={isUploadingImage || isSaving}
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or WEBP up to 8MB.
                </p>

                {localAvatar && (
                  <p className="text-[11px] text-amber-700 font-semibold">
                    Image service is unavailable. This photo is saved safely in this browser and will be retried when you save.
                  </p>
                )}

                {uploadError && (
                  <p className="text-[11px] text-rose-600 font-semibold">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Qualification
            </label>
            <input
              type="text"
              maxLength={500}
              value={profile.qualification || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  qualification: e.target.value,
                }))
              }
              placeholder="e.g., Ph.D. in Plant Pathology (BAU), M.Sc. in Agriculture"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Experience Years
            </label>
            <input
              type="number"
              min={0}
              max={80}
              step={1}
              value={profile.experienceYears || 0}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  experienceYears: Number(e.target.value),
                }))
              }
              placeholder="e.g., 14"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Institution / Workplace */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Institution / Workplace
            </label>
            <input
              type="text"
              maxLength={200}
              value={profile.institution || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  institution: e.target.value,
                }))
              }
              placeholder="e.g., Bangladesh Agricultural University (BAU)"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Location / Region
            </label>
            <input
              type="text"
              maxLength={250}
              value={profile.location || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="e.g., Dhaka / Mymensingh, Bangladesh"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Specialization Tags */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Specialization Tags
            </label>

            <span className="text-[11px] font-semibold text-slate-400">
              {profile.specialization.length}/{MAX_SPECIALIZATIONS}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {profile.specialization?.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 border border-emerald-200 shadow-sm"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(spec)}
                  className="rounded-full p-0.5 hover:bg-emerald-200/70 text-emerald-700 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              maxLength={80}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add specialization (e.g. Crop Pathology, Soil Health)..."
              className="flex-1 rounded-xl border border-slate-200 py-2.5 px-3 text-xs focus:border-emerald-500 focus:outline-none shadow-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Bio
          </label>
          <textarea
            rows={5}
            maxLength={3000}
            value={profile.bio || ""}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Share your expertise, field research background, and consultation advisory approach..."
            className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 leading-relaxed shadow-sm font-normal"
          />
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="sticky bottom-4 z-20 flex flex-col items-stretch justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3.5 shadow-[0_18px_55px_rgba(15,23,42,0.14)] backdrop-blur sm:flex-row sm:items-center sm:p-4">
        <div>
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fade-in">
              <Check className="h-4 w-4" />
              Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Role and email are secured and managed via authentication settings.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving || isUploadingImage}
          className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#0b5d42] px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#084a35] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
