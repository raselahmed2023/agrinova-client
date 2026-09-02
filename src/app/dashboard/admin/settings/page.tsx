"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";

interface AdminProfile {
  name: string;
  phone: string;
  email: string;
}

interface IProfileResponse {
  success: boolean;
  data?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  message?: string;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<AdminProfile>({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    adminService
      .getAdminProfile()
      .then((response: unknown) => {
        const res = response as IProfileResponse;
        if (res && res.success && res.data) {
          setProfile({
            name: res.data.name || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
          });
        }
      })
      .catch((err: unknown) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await adminService.updateAdminProfile({
        name: profile.name,
        phone: profile.phone,
      });
      const res = response as IProfileResponse;
      if (res && res.success) {
        alert("Profile updated successfully!");
      } else {
        alert(res?.message || "Failed to update profile.");
      }
    } catch (err: unknown) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading settings...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Settings</h1>
        <p className="text-sm text-slate-500">Update your admin profile information.</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address (Read-only)</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/10 text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone Number</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/10 text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}