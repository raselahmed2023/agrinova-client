"use client";

import React from "react";
import { TrendingUp, TrendingDown, Wallet, ChevronDown } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const chartData = [
  { name: "Week 1", Income: 45, Expense: 15 },
  { name: "Week 2", Income: 70, Expense: 25 },
  { name: "Week 3", Income: 35, Expense: 45 },
];

export default function FinanceSummary({ transactions }: { transactions: any[] }) {
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Income
              </p>
              <h2 className="text-2xl font-bold text-[#063928] mt-3">
                ৳{totalIncome.toLocaleString()}
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">All recorded income</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Expense
              </p>
              <h2 className="text-2xl font-bold text-rose-600 mt-3">
                ৳{totalExpense.toLocaleString()}
              </h2>
            </div>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">All recorded expenses</p>
        </div>

        {/* Net Profit */}
        <div className="bg-[#EAF5F0] p-5 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Net Profit
              </p>
              <h2 className="text-2xl font-bold text-[#063928] mt-3">
                ৳{netProfit.toLocaleString()}
              </h2>
            </div>
            <div className="p-2.5 rounded-lg bg-white/70 text-emerald-800 backdrop-blur-sm">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Income – Expense</p>
        </div>
      </div>
    </div>
  );
}

// Chart Component export standard
export function FinanceOverviewChart() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-base">Overview</h3>
          <button className="flex items-center gap-1 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white">
            This Month <ChevronDown size={14} />
          </button>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="Income" fill="#063928" radius={[2, 2, 0, 0]} barSize={22} />
              <Bar dataKey="Expense" fill="#E15252" radius={[2, 2, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#063928]" />
          <span className="text-xs text-slate-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E15252]" />
          <span className="text-xs text-slate-600">Expense</span>
        </div>
      </div>
    </div>
  );
}