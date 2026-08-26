"use client";

import FinanceSummary, { FinanceOverviewChart } from "@/components/dashboard/finance/FinanceSummary";
import TransactionForm from "@/components/dashboard/finance/TransactionForm";
import TransactionList from "@/components/dashboard/finance/TransactionList";
import React, { useState } from "react";


export default function FinancePage() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: "Vegetable Sale",
      subtitle: "North Field Harvest",
      category: "Crop Sales",
      type: "Income",
      date: "Oct 24, 2023",
      amount: 18000,
    },
    {
      id: 2,
      title: "Fertilizer Purchase",
      subtitle: "Urea 50kg x2",
      category: "Inputs & Supplies",
      type: "Expense",
      date: "Oct 22, 2023",
      amount: 4500,
    },
    {
      id: 3,
      title: "Irrigation Cost",
      subtitle: "Pump fuel for South Plot",
      category: "Utilities",
      type: "Expense",
      date: "Oct 20, 2023",
      amount: 2000,
    },
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#063928]">Finance</h1>
          <p className="text-sm text-slate-500">
            Track your farming income, expenses, and profit in one place.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <TransactionForm />
        </div>
      </div>

      {/* FinanceSummary-তে ডেটা পাঠানো হচ্ছে */}
      <div className="mb-6">
        <FinanceSummary transactions={transactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <FinanceOverviewChart />
        </div>
        
        {/* TransactionList-এ ডেটা পাঠানো হচ্ছে */}
        <div className="lg:col-span-8">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}