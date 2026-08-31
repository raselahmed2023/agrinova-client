"use client";

import React, { useState } from "react";
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
  const [profile, setProfile] = useState<ExpertProfile>(initialProfile);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !profile.specialization.includes(newTag.trim())) {
      setProfile((prev) => ({
        ...prev,
        specialization: [...prev.specialization, newTag.trim()],
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
    setIsSaving(true);
    try {
      await onSave(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner Card: Expert Identity */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-emerald-100 border-2 border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-900 text-2xl shadow-inner">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-black text-slate-900">
                  {profile.name}
                </h3>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Specialist
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                {profile.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {profile.rating} ({profile.ratingCount} reviews)
                </span>
                <span>·</span>
                <span>{profile.totalConsultations} Consultations Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Professional Title / Designation
            </label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Highest Educational Qualification
            </label>
            <input
              type="text"
              value={profile.qualification}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  qualification: e.target.value,
                }))
              }
              placeholder="e.g., Ph.D. in Agronomy"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Institution / Organization
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
              placeholder="e.g., Bangladesh Agricultural Research Institute (BARI)"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Experience Years */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Years of Field Experience
            </label>
            <input
              type="number"
              min={0}
              value={profile.experienceYears}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  experienceYears: Number(e.target.value),
                }))
              }
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Consultation Fee (BDT per session)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={profile.consultationFee}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  consultationFee: Number(e.target.value),
                }))
              }
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Specialization tags */}
        <div className="pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Areas of Specialization & Crops
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {profile.specialization.map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 border border-emerald-200"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(spec)}
                  className="rounded-full p-0.5 hover:bg-emerald-200/70 text-emerald-700"
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
              placeholder="Add tag (e.g., Soil Fertility, Rice Disease)..."
              className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-xs focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-6 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Professional Biography
          </label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) =>
              setProfile((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur shadow-lg">
        <div>
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="h-4 w-4" />
              Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes will immediately reflect on the farmer directory.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving Changes..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
