"use client";

import React, { useState } from "react";
import { Search, Filter, MoreVertical, ChevronDown, Edit, Trash2 } from "lucide-react";

interface TransactionListProps {
  transactions: any[];
  onEdit?: (transaction: any) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Safe Search Filter Logic
  const filteredData = (transactions || []).filter((t) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = t?.title?.toLowerCase().includes(term) ?? false;
    const categoryMatch = t?.category?.toLowerCase().includes(term) ?? false;
    const farmMatch = t?.farm?.toLowerCase().includes(term) ?? false;
    return titleMatch || categoryMatch || farmMatch;
  });

  const toggleMenu = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full relative">
      <div>
        <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Transactions</h3>

        {/* Filters Header */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              All Types <ChevronDown size={14} />
            </button>
            <button className="p-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[250px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                <th className="py-2.5 px-2">Transaction</th>
                <th className="py-2.5 px-2">Category</th>
                <th className="py-2.5 px-2">Type</th>
                <th className="py-2.5 px-2">Date</th>
                <th className="py-2.5 px-2 text-right">Amount</th>
                <th className="py-2.5 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item._id || item.id} className="text-xs text-slate-700">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-800">{item.title || item.category}</p>
                      <p className="text-[11px] text-slate-400">{item.subtitle || item.farm}</p>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600">{item.category}</td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.type === "Income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-500">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold">
                      <span className={item.type === "Income" ? "text-emerald-800" : "text-rose-500"}>
                        {item.type === "Income" ? "+" : "-"} ৳{(item.amount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center relative">
                      <button
                        onClick={() => toggleMenu(item._id || item.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === (item._id || item.id) && (
                        <div className="absolute right-2 top-10 w-28 bg-white border border-slate-100 rounded-lg shadow-lg z-20 py-1 text-left">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEdit?.(item);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <Edit size={12} className="text-slate-500" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete?.(item._id || item.id);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={12} className="text-rose-500" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 pt-3 text-center border-t border-slate-100">
        <button className="text-xs font-semibold text-[#063928] hover:underline">
          View All Transactions
        </button>
      </div>
    </div>
  );
}