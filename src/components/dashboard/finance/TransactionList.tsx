"use client";

import React, { useState } from "react";
import { Search, Filter, MoreVertical, ChevronDown } from "lucide-react";

export default function TransactionList({ transactions }: { transactions: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
console.log('transactions', transactions)
  // const filteredData = transactions.filter((t) =>
  //   t?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
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
        <div className="overflow-x-auto">
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
              {transactions.map((item) => (
                <tr key={item._id} className="text-xs text-slate-700">
                  <td className="py-3.5 px-2">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
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
                  <td className="py-3.5 px-2 text-slate-500">{item.date}</td>
                  <td className="py-3.5 px-2 text-right font-bold">
                    <span className={item.type === "Income" ? "text-emerald-800" : "text-rose-500"}>
                      {item.type === "Income" ? "+" : "-"} ৳{item.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
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