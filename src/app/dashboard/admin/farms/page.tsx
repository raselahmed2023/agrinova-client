"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import Link from "next/link";
import { Eye, MapPin } from "lucide-react";

interface FarmItem {
  _id: string;
  name: string;
  district?: string;
  landArea?: number | string;
  unit?: string;
  soilType?: string;
}

interface IFarmsResponse {
  success: boolean;
  data: FarmItem[];
}

export default function AdminFarmsPage() {
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService
      .getAdminFarms()
      .then((response: unknown) => {
        const res = response as IFarmsResponse;
        if (res && res.success) {
          setFarms(res.data);
        }
      })
      .catch((err: unknown) => console.error("Failed to load farms", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Farms Monitoring</h1>
        <p className="text-sm text-slate-500">View and monitor all registered farms across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Farm Name</th>
                <th className="py-3 px-6">District</th>
                <th className="py-3 px-6">Land Area</th>
                <th className="py-3 px-6">Soil Type</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading farms...</td>
                </tr>
              ) : farms.length > 0 ? (
                farms.map((farm) => (
                  <tr key={farm._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{farm.name}</td>
                    <td className="py-3.5 px-6 text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {farm.district || "N/A"}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {farm.landArea ?? "N/A"} {farm.unit || "acres"}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{farm.soilType || "N/A"}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/dashboard/admin/farms/${farm._id}`}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No farms found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}