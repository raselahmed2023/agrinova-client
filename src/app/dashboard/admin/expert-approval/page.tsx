"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";
import { UserCheck, XCircle, Eye } from "lucide-react";

interface ExpertItem {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  qualification?: string;
  status: string;
}

interface IApiResponse {
  success: boolean;
  message?: string;
  data: ExpertItem[];
}

export default function ExpertApprovalPage() {
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPendingExperts = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingExperts();
      const res = response as IApiResponse;
      if (res && res.success) {
        setExperts(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load pending experts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingExperts();
  }, []);

  const handleApprove = async (expertId: string) => {
    try {
      const response = await adminService.approveExpert(expertId);
      const res = response as { success: boolean; message?: string };
      if (res && res.success) {
        fetchPendingExperts();
      } else {
        alert(res?.message || "Approval failed");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Approval failed");
    }
  };

  const handleReject = async (expertId: string) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      const response = await adminService.rejectExpert(expertId, reason || undefined);
      const res = response as { success: boolean; message?: string };
      if (res && res.success) {
        fetchPendingExperts();
      } else {
        alert(res?.message || "Rejection failed");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Rejection failed");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Expert Approval</h1>
        <p className="text-sm text-slate-500">Review and verify pending expert applications for the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Specialization</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading pending requests...</td>
                </tr>
              ) : experts.length > 0 ? (
                experts.map((expert) => (
                  <tr key={expert._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{expert.name}</td>
                    <td className="py-3.5 px-6 text-slate-500">{expert.email}</td>
                    <td className="py-3.5 px-6 text-slate-600">{expert.specialization || "N/A"}</td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        {expert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <Link
                        href={`/dashboard/admin/expert-approval/${expert._id}`}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Link>
                      <button
                        onClick={() => handleApprove(expert._id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                      >
                        <UserCheck className="w-3.5 h-3.5 mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(expert._id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No pending expert requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}