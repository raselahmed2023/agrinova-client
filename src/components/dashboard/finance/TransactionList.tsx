"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, ChevronDown, Edit, Trash2, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface TransactionListProps {
  transactions: any[];
  onRefresh?: () => void;
  onDelete?: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onRefresh,
  onDelete,
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Edit Modal State inside component
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal Form States
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Crop Sales");
  const [farm, setFarm] = useState("North Field (Wheat)");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Edit এ ক্লিক করলে ফর্ম ডাটা পপুলেট করা
  const handleEditClick = (item: any) => {
    setSelectedTransaction(item);
    setType(item.type || "Income");
    setAmount(item.amount ? String(item.amount) : "");
    setCategory(item.category || "Crop Sales");
    setFarm(item.farm || "North Field (Wheat)");
    
    if (item.date) {
      const formattedDate = new Date(item.date).toISOString().split("T")[0];
      setDate(formattedDate);
    } else {
      setDate("");
    }
    
    setDescription(item.description || "");
    setStatus(null);
    setIsEditOpen(true);
  };

  const handleModalClose = () => {
    setIsEditOpen(false);
    setSelectedTransaction(null);
    setStatus(null);
  };

  // API Submit Handler
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    setStatus(null);
    const transactionId = selectedTransaction._id || selectedTransaction.id;

    const payload = {
      type,
      amount: Number(amount),
      category,
      farm,
      date,
      description,
    };

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/finance/transactions/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        setStatus({
          type: "success",
          message: data?.message || "Transaction updated successfully!",
        });

        // Refresh parent list
        if (onRefresh) onRefresh();

        setTimeout(() => {
          handleModalClose();
        }, 1200);
      } else {
        setStatus({
          type: "error",
          message: data?.message || `Server Error (${response.status}): Failed to update`,
        });
      }
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      setStatus({
        type: "error",
        message: "Server is unreachable or returned invalid response!",
      });
    } finally {
      setLoading(false);
    }
  };

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
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
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
                              handleEditClick(item);
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

      {/* --- Inline Edit Modal --- */}
      {isEditOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-800">Edit Transaction</h3>
              <button
                type="button"
                onClick={handleModalClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Alert */}
            {status && (
              <div
                className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdateSubmit}>
              <div className="p-6 space-y-4 text-xs text-slate-700">
                {/* Type Toggle */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Transaction Type
                  </label>
                  <div className="flex p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setType("Income")}
                      className={`flex-1 py-1.5 text-center font-semibold rounded-md transition-all ${
                        type === "Income"
                          ? "bg-white text-[#063928] shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("Expense")}
                      className={`flex-1 py-1.5 text-center font-semibold rounded-md transition-all ${
                        type === "Expense"
                          ? "bg-white text-[#063928] shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 pr-8 cursor-pointer"
                    >
                      <option value="Crop Sales">Crop Sales</option>
                      <option value="Inputs & Supplies">Inputs & Supplies</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Equipment">Equipment</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Farm */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Related Farm
                  </label>
                  <div className="relative">
                    <select
                      value={farm}
                      onChange={(e) => setFarm(e.target.value)}
                      className="w-full appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 pr-8 cursor-pointer"
                    >
                      <option value="North Field (Wheat)">North Field (Wheat)</option>
                      <option value="South Field (Rice)">South Field (Rice)</option>
                      <option value="East Plot">East Plot</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-500 uppercase"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Description <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={loading}
                  className="px-5 py-2 font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2 font-semibold text-[#063928] bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors disabled:opacity-50 min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}