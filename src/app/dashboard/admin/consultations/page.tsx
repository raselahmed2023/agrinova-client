"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";

interface IConsultation {
  _id: string;
  farmerName?: string;
  userId?: string;
  expertName?: string;
  expertId?: string;
  status?: "PENDING" | "ACCEPTED" | "ONGOING" | "COMPLETED" | string;
  scheduledDate?: string;
  date?: string;
  createdAt?: string;
}

interface IConsultationResponse {
  success: boolean;
  data: IConsultation[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<IConsultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService
      .getAdminConsultations()
      .then((response: unknown) => {
        const res = response as IConsultationResponse;
        if (res && res.success) {
          setConsultations(res.data);
        }
      })
      .catch((err: unknown) =>
        console.error("Failed to load consultations", err),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Consultations Monitoring
        </h1>
        <p className="text-sm text-slate-500">
          View and monitor all expert and farmer consultation sessions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Farmer / User</th>
                <th className="py-3 px-6">Expert</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Date / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Loading consultations...
                  </td>
                </tr>
              ) : consultations.length > 0 ? (
                consultations.map((item) => {
                  const consultationDate = item.scheduledDate || item.date || item.createdAt;
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="py-3.5 px-6 font-medium text-slate-800">
                        {item.farmerName || item.userId || "N/A"}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600">
                        {item.expertName || item.expertId || "N/A"}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "ONGOING"
                                ? "bg-blue-50 text-blue-700"
                                : item.status === "ACCEPTED"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status || "PENDING"}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right text-slate-500">
                        {consultationDate
                          ? new Date(consultationDate).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No consultations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}