"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Sparkles,
  ShieldCheck,
  Star,
  RefreshCw,
} from "lucide-react";
import ExpertProfileForm from "@/components/expert/ExpertProfileForm";
import {
  getExpertProfile,
  updateExpertProfile,
} from "@/services/expert.service";
import type { ExpertProfile } from "@/types/expert";

export default function ExpertProfilePage() {
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getExpertProfile();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load expert profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (updated: Partial<ExpertProfile>) => {
    const res = await updateExpertProfile(updated);
    setProfile(res);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/expert"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Overview
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Expert Profile Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your public bio, agricultural specializations, hourly consultation fee, and academic credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
      ) : profile ? (
        <ExpertProfileForm initialProfile={profile} onSave={handleSave} />
      ) : (
        <div className="p-8 text-center text-slate-500">Failed to load profile.</div>
      )}
    </div>
  );
}
