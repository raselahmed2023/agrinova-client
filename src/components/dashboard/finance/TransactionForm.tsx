"use client";

import React, { useState } from "react";
import { Plus, X, ChevronDown, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function TransactionForm({ onAdd }: { onAdd?: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Status message (success or error) modal er bhetore show korar jonno
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form Field States
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Crop Sales");
  const [farm, setFarm] = useState("North Field (Wheat)");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const resetForm = () => {
    setAmount("");
    setDate("");
    setDescription("");
    setStatus(null);
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!userId) {
      setStatus({ type: "error", message: "User session not found! Please login again." });
      return;
    }

    const payload = {
      type,
      amount: Number(amount),
      category,
      date,
      description,
      userId,
    };

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/finance/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Server theke JSON na asle safe handle korar jonno (Try-Catch Parsing)
      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        setStatus({
          type: "success",
          message: data?.message || "Transaction added successfully!",
        });

        if (onAdd) onAdd(data || payload);

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: data?.message || `Server Error (${response.status}): Failed to save transaction`,
        });
      }
    } catch (error: any) {
      console.error("Error posting transaction:", error);
      setStatus({
        type: "error",
        message: "Server is unreachable or returned invalid response!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-[#063928] hover:bg-[#04281c] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        <Plus size={16} /> Add Transaction
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-800">Add Transaction</h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Alert Banner inside Modal */}
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

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 text-xs text-slate-700">
                {/* Transaction Type Toggle */}
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

                {/* Amount Field */}
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

                {/* Category Dropdown */}
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

                {/* Related Farm Dropdown */}
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

                {/* Date Input */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-500 uppercase"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block font-semibold mb-1.5 text-slate-700">
                    Description <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter details about this transaction..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-white">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#063928] hover:bg-[#04281c] rounded-lg transition-colors disabled:opacity-50 min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Transaction"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}