"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminUserService } from "@/services/admin.user.service";
import { ArrowLeft, Mail, Shield, CheckCircle2, Ban, Calendar } from "lucide-react";

interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface IUserResponse {
  success?: boolean;
  data?: UserProfile;
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      adminUserService
        .getUserById(userId)
        .then((response: unknown) => {
          const res = response as IUserResponse;
          if (res && (res.success || res.data)) {
            setUser(res.data || (res as unknown as UserProfile));
          }
        })
        .catch((err: unknown) => console.error("Failed to load user details", err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">User not found.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl">
              {user.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === "ADMIN" ? "bg-purple-50 text-purple-700" :
              user.role === "EXPERT" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
            }`}>
              <Shield className="h-3 w-3 mr-1" /> {user.role}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              user.status === "ACTIVE" || user.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : 
              user.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
            }`}>
              {user.status === "BLOCKED" ? <Ban className="h-3 w-3 mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
              {user.status || "ACTIVE"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">User ID</p>
            <p className="font-mono text-slate-700 break-all">{user._id || user.id}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">Email Verified</p>
            <p className="font-medium text-slate-700">{user.emailVerified ? "Yes" : "No"}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">Created At</p>
            <p className="font-medium text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">Last Updated</p>
            <p className="font-medium text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}