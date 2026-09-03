"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { ArrowLeft, Mail, Award, BookOpen, CheckCircle, XCircle } from "lucide-react";

interface ExpertDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  specialization?: string;
  qualification?: string;
  experience?: string;
  createdAt?: string;
}

interface IApiResponse {
  success?: boolean;
  message?: string;
  data?: ExpertDetail;
}

export default function ExpertDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const expertId = params.expertId as string;

  const [expert, setExpert] = useState<ExpertDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (expertId) {
      adminService.getExpertById(expertId)
        .then((response: unknown) => {
          const res = response as IApiResponse & ExpertDetail;
          if (res && (res.success || res.data)) {
            setExpert(res.data || res);
          }
        })
        .catch((err: unknown) => console.error("Failed to load expert details", err))
        .finally(() => setLoading(false));
    }
  }, [expertId]);

  const handleApprove = async () => {
    try {
      const response = await adminService.approveExpert(expertId);
      const res = response as IApiResponse;
      if (res && res.success) {
        router.push("/dashboard/admin/expert-approval");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to approve");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    try {
      const response = await adminService.rejectExpert(expertId, reason || undefined);
      const res = response as IApiResponse;
      if (res && res.success) {
        router.push("/dashboard/admin/expert-approval");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to reject");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading expert profile...</div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">Expert not found.</p>
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
        <ArrowLeft className="h-4 w-4" /> Back to Approvals
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl">
              {expert.name?.charAt(0) || "E"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{expert.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {expert.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
            </button>
            <button
              onClick={handleReject}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm"
            >
              <XCircle className="w-4 h-4 mr-1.5" /> Reject
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Specialization
            </p>
            <p className="font-semibold text-slate-800">{expert.specialization || "Not specified"}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Qualification
            </p>
            <p className="font-semibold text-slate-800">{expert.qualification || "Not specified"}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">Experience</p>
            <p className="font-medium text-slate-700">{expert.experience || "N/A"}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <p className="text-slate-400 font-medium text-xs">Application Status</p>
            <p className="font-medium text-amber-600 uppercase">{expert.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}