"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Transaction {
  _id?: string;
  id?: string;
  type: "Income" | "Expense";
  amount: number | string;
  category?: string;
  farm?: string;
  date?: string | Date;
  description?: string;
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface FinanceSummaryProps {
  transactions?: Transaction[];
}



export default function FinanceSummary({
  transactions = [],
}: FinanceSummaryProps) {
  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((total, transaction) => {
        return total + (Number(transaction.amount) || 0);
      }, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((total, transaction) => {
        return total + (Number(transaction.amount) || 0);
      }, 0);
  }, [transactions]);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
  

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

          <p className="text-xs text-slate-400 mt-4">
            All recorded income
          </p>
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

          <p className="text-xs text-slate-400 mt-4">
            All recorded expenses
          </p>
        </div>

        {/* Net Profit */}

        <div className="bg-[#EAF5F0] p-5 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Net Profit
              </p>

              <h2
                className={`text-2xl font-bold mt-3 ${
                  netProfit >= 0
                    ? "text-[#063928]"
                    : "text-rose-600"
                }`}
              >
                ৳{netProfit.toLocaleString()}
              </h2>
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 text-emerald-800 backdrop-blur-sm">
              <Wallet size={20} />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Income − Expense
          </p>
        </div>
      </div>
    </div>
  );
}



interface FinanceOverviewChartProps {
  transactions?: Transaction[];
}

export function FinanceOverviewChart({
  transactions = [],
}: FinanceOverviewChartProps) {
  const now = new Date();

  const [selectedMonth, setSelectedMonth] = React.useState(
    now.getMonth()
  );

  const [selectedYear, setSelectedYear] = React.useState(
    now.getFullYear()
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];


  const years = useMemo(() => {
    const transactionYears = transactions
      .filter((transaction) => transaction.date)
      .map((transaction) => {
        const date = new Date(transaction.date!);

        return date.getFullYear();
      })
      .filter((year) => !Number.isNaN(year));

    const uniqueYears = [...new Set(transactionYears)];

    // Current year always available
    if (!uniqueYears.includes(now.getFullYear())) {
      uniqueYears.push(now.getFullYear());
    }

    return uniqueYears.sort((a, b) => b - a);
  }, [transactions]);



  const chartData = useMemo(() => {
    const weeks = [
      {
        name: "Week 1",
        Income: 0,
        Expense: 0,
      },
      {
        name: "Week 2",
        Income: 0,
        Expense: 0,
      },
      {
        name: "Week 3",
        Income: 0,
        Expense: 0,
      },
      {
        name: "Week 4",
        Income: 0,
        Expense: 0,
      },
    ];

    transactions.forEach((transaction) => {
      if (!transaction.date) return;

      const date = new Date(transaction.date);

      // Invalid date
      if (Number.isNaN(date.getTime())) return;


      if (
        date.getMonth() !== selectedMonth ||
        date.getFullYear() !== selectedYear
      ) {
        return;
      }

      const day = date.getDate();

      // 1-7   = Week 1
      // 8-14  = Week 2
      // 15-21 = Week 3
      // 22+   = Week 4
      const weekIndex = Math.min(
        Math.floor((day - 1) / 7),
        3
      );

      const amount = Number(transaction.amount) || 0;

      if (transaction.type === "Income") {
        weeks[weekIndex].Income += amount;
      }

      if (transaction.type === "Expense") {
        weeks[weekIndex].Expense += amount;
      }
    });

    return weeks;
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
      <div>


        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-base">
            Overview
          </h3>

          <div className="flex items-center gap-2">
            {/* Month */}

            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    Number(event.target.value)
                  )
                }
                className="appearance-none text-xs text-slate-600 border border-slate-200 px-3 py-2 pr-8 rounded-lg bg-white outline-none cursor-pointer"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
              />
            </div>

            {/* Year */}

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(event) =>
                  setSelectedYear(
                    Number(event.target.value)
                  )
                }
                className="appearance-none text-xs text-slate-600 border border-slate-200 px-3 py-2 pr-8 rounded-lg bg-white outline-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
              />
            </div>
          </div>
        </div>



        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -25,
                bottom: 0,
              }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "transparent",
                }}
                formatter={(value, name) => [
                  `৳${Number(value).toLocaleString()}`,
                  name,
                ]}
              />

              <Bar
                dataKey="Income"
                fill="#063928"
                radius={[2, 2, 0, 0]}
                barSize={22}
              />

              <Bar
                dataKey="Expense"
                fill="#E15252"
                radius={[2, 2, 0, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>



      <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#063928]" />
          <span className="text-xs text-slate-600">
            Income
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E15252]" />
          <span className="text-xs text-slate-600">
            Expense
          </span>
        </div>
      </div>
    </div>
  );
}