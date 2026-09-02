"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { ArrowLeft, Tractor, MapPin, Layers, Calendar } from "lucide-react";

interface FarmDetails {
  _id: string;
  name: string;
  district?: string;
  landArea?: number;
  unit?: string;
  soilType?: string;
  createdAt?: string;
}

interface IFarmResponse {
  success: boolean;
  data: FarmDetails;
}

export default function AdminFarmDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const farmId = params?.farmId as string;

  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!farmId) return;
    adminService
      .getAdminFarmById(farmId)
      .then((response: unknown) => {
        const res = response as IFarmResponse;
        if (res && res.success) {
          setFarm(res.data);
        }
      })
      .catch((err: unknown) => console.error("Failed to load farm details", err))
      .finally(() => setLoading(false));
  }, [farmId]);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading farm details...</div>;

  if (!farm) return (
    <div className="p-12 text-center space-y-4">
      <p className="text-slate-500">Farm not found.</p>
      <button onClick={() => router.back()} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Farms
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{farm.name}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" /> {farm.district || "District not specified"}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Tractor className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Land Area
            </span>
            <p className="text-lg font-bold text-slate-800">{farm.landArea || 0} {farm.unit || "acres"}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soil Type</span>
            <p className="text-lg font-bold text-slate-800">{farm.soilType || "N/A"}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Registered Date
            </span>
            <p className="text-sm font-medium text-slate-700">
              {farm.createdAt ? new Date(farm.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}