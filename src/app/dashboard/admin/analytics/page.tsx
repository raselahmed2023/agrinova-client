"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Users, Tractor, ShoppingBag, ShieldCheck } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

interface AnalyticsData {
  users?: {
    farmers: number;
    experts: number;
    admins: number;
  };
  farms?: {
    total: number;
  };
  marketplace?: {
    active: number;
    disabled: number;
  };
  consultations?: {
    pending: number;
    accepted: number;
    ongoing: number;
    completed: number;
  };
  expertApprovals?: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

interface IAnalyticsResponse {
  success?: boolean;
  data?: AnalyticsData;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService
      .getAdminAnalytics()
      .then((response: unknown) => {
        const res = response as IAnalyticsResponse;
        if (res && res.success && res.data) {
          setAnalytics(res.data);
        }
      })
      .catch((err: unknown) => console.error("Failed to load analytics", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-400 font-medium">Loading platform analytics...</div>;

  const userChartData = [
    { name: "Farmers", count: analytics?.users?.farmers || 0 },
    { name: "Experts", count: analytics?.users?.experts || 0 },
    { name: "Admins", count: analytics?.users?.admins || 0 },
  ];

  const consultationChartData = [
    { name: "Pending", value: analytics?.consultations?.pending || 0 },
    { name: "Accepted", value: analytics?.consultations?.accepted || 0 },
    { name: "Ongoing", value: analytics?.consultations?.ongoing || 0 },
    { name: "Completed", value: analytics?.consultations?.completed || 0 },
  ];

  const marketplaceChartData = [
    { name: "Active", value: analytics?.marketplace?.active || 0 },
    { name: "Disabled", value: analytics?.marketplace?.disabled || 0 },
  ];

  const expertApprovalData = [
    { name: "Pending", value: analytics?.expertApprovals?.pending || 0 },
    { name: "Approved", value: analytics?.expertApprovals?.approved || 0 },
    { name: "Rejected", value: analytics?.expertApprovals?.rejected || 0 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
        <p className="text-sm text-slate-500">Visual overview of user distribution, marketplace status, and system metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Farms</p>
            <h3 className="text-2xl font-bold text-slate-800">{analytics?.farms?.total || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Tractor className="w-5 h-5" /></div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Products</p>
            <h3 className="text-2xl font-bold text-slate-800">{analytics?.marketplace?.active || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Farmers</p>
            <h3 className="text-2xl font-bold text-slate-800">{analytics?.users?.farmers || 0}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Users className="w-5 h-5" /></div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-slate-800">{analytics?.expertApprovals?.pending || 0}</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">User Role Distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Consultation Status Breakdown</h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consultationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {consultationChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Marketplace Product Status</h2>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketplaceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {marketplaceChartData.map((_, index) => (
                    <Cell key={`cell-market-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-800">Expert Applications Overview</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expertApprovalData} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}