"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  DollarSign,
  Languages,
  MapPin,
  Save,
  Check,
  Plus,
  X,
  Star,
  ShieldCheck,
  Lock,
  Upload,
  Camera,
  Trash2,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import type { ExpertProfile } from "@/types/expert";

interface ExpertProfileFormProps {
  initialProfile: ExpertProfile;
  onSave: (updated: Partial<ExpertProfile>) => Promise<void> | void;
}

export default function ExpertProfileForm({
  initialProfile,
  onSave,
}: ExpertProfileFormProps) {
  const sanitizeProfile = (p: ExpertProfile): ExpertProfile => ({
    ...p,
    specialization: Array.isArray(p.specialization)
      ? p.specialization
      : typeof p.specialization === "string" && (p.specialization as string).trim()
      ? (p.specialization as string).split(",").map((s) => s.trim())
      : [],
    consultationFee: typeof p.consultationFee === "number" ? p.consultationFee : 500,
  });

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

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB.");
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
          setProfile((prev) => ({
            ...prev,
            avatar: data.url,
          }));
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("expert-profile-updated", {
                detail: { avatar: data.url },
              })
            );
          }
        } else {
          setUploadError(data.message || "Failed to upload image.");
        }
      } else {
        setUploadError("Server failed to upload image.");
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setProfile((prev) => ({ ...prev, avatar: "" }));
    setUploadError(null);
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
    if (trimmed && !profile.specialization.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        specialization: [...prev.specialization, trimmed],
      }));
      setNewTag("");
    }
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
    setIsSaving(true);
    try {
      // Exclude email, role, status from payload to ensure they remain untouched
      const { email, ...payloadToUpdate } = profile;
      await onSave(payloadToUpdate);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("expert-profile-updated", {
            detail: { avatar: profile.avatar },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner Card: Expert Identity & Current Stats */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-emerald-100 border-2 border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-900 text-2xl shadow-inner">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
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
                  {profile.rating || 5.0} ({profile.ratingCount || 0} reviews)
                </span>
                <span>·</span>
                <span>{profile.totalConsultations || 0} Consultations Completed</span>
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
              type="text"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="+880 1712-345678"
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
                min={0}
                max={50000}
                step={50}
                required
                value={profile.consultationFee ?? 500}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    consultationFee: Number(e.target.value),
                  }))
                }
                placeholder="500"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-9 pr-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your advisory rate charged to farmers per booked video consultation session.
            </p>
          </div>

          {/* Picture Uploadable Section (Replaced URL Input) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
              <div className="relative h-14 w-14 shrink-0 rounded-xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-800 text-lg shadow-inner">
                {profile.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar}
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
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-950 transition disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {isUploadingImage
                      ? "Uploading..."
                      : profile.avatar
                      ? "Change Photo"
                      : "Upload Photo"}
                  </button>
                  {profile.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or WEBP up to 5MB.
                </p>
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
              max={60}
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
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Specialization Tags
          </label>
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
            rows={4}
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
      <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3.5 sm:p-4 backdrop-blur shadow-lg">
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
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 active:scale-98"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
