"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Tractor,
  Users,
} from "lucide-react";

import {
  adminService,
  type AdminAnalyticsData,
} from "@/services/admin.service";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#64748b",
  "#06b6d4",
];

export default function AdminAnalyticsPage() {
  const [
    analytics,
    setAnalytics,
  ] =
    useState<
      AdminAnalyticsData | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const loadAnalytics =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const result =
          await adminService.getAdminAnalytics();

        setAnalytics(
          result
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void loadAnalytics();
  }, []);

  if (
    loading &&
    !analytics
  ) {
    return (
      <div className="p-12 text-center text-sm font-medium text-slate-400">
        Loading platform
        analytics...
      </div>
    );
  }

  const userChartData = [
    {
      name:
        "Farmers",

      count:
        analytics?.users
          .farmers ||
        0,
    },

    {
      name:
        "Experts",

      count:
        analytics?.users
          .experts ||
        0,
    },

    {
      name:
        "Admins",

      count:
        analytics?.users
          .admins ||
        0,
    },
  ];

  const consultationChartData =
    [
      {
        name:
          "Pending",

        value:
          analytics
            ?.consultations
            .pending ||
          0,
      },

      {
        name:
          "Accepted",

        value:
          analytics
            ?.consultations
            .accepted ||
          0,
      },

      {
        name:
          "Scheduled",

        value:
          analytics
            ?.consultations
            .scheduled ||
          0,
      },

      {
        name:
          "Ongoing",

        value:
          analytics
            ?.consultations
            .ongoing ||
          0,
      },

      {
        name:
          "Completed",

        value:
          analytics
            ?.consultations
            .completed ||
          0,
      },

      {
        name:
          "Rejected",

        value:
          analytics
            ?.consultations
            .rejected ||
          0,
      },

      {
        name:
          "Cancelled",

        value:
          analytics
            ?.consultations
            .cancelled ||
          0,
      },
    ];

  
  const marketplaceChartData =
    [
      {
        name:
          "Live",

        value:
          analytics
            ?.marketplace
            .active ||
          0,
      },

      {
        name:
          "Legacy Pending",

        value:
          analytics
            ?.marketplace
            .pending ||
          0,
      },

      {
        name:
          "Out of Stock",

        value:
          analytics
            ?.marketplace
            .outOfStock ||
          0,
      },

      {
        name:
          "Hidden",

        value:
          analytics
            ?.marketplace
            .disabled ||
          0,
      },

      {
        name:
          "Removed",

        value:
          analytics
            ?.marketplace
            .removed ||
          0,
      },
    ];

  const expertApprovalData =
    [
      {
        name:
          "Pending",

        value:
          analytics
            ?.expertApprovals
            .pending ||
          0,
      },

      {
        name:
          "Approved",

        value:
          analytics
            ?.expertApprovals
            .approved ||
          0,
      },

      {
        name:
          "Rejected",

        value:
          analytics
            ?.expertApprovals
            .rejected ||
          0,
      },

      {
        name:
          "Blocked",

        value:
          analytics
            ?.expertApprovals
            .blocked ||
          0,
      },
    ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
            Reporting
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Platform Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Real database
            counts for users,
            farms, marketplace,
            consultations and
            Expert applications.
          </p>
        </div>

        <button
          type="button"
          disabled={
            loading
          }
          onClick={() =>
            void loadAnalytics()
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Farms"
          value={
            analytics?.farms
              .total ||
            0
          }
          subtext={`${analytics?.farms.active || 0} active`}
          icon={
            Tractor
          }
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          label="Live Products"
          value={
            analytics
              ?.marketplace
              .active ||
            0
          }
          subtext={`${analytics?.marketplace.outOfStock || 0} out of stock`}
          icon={
            ShoppingBag
          }
          iconClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          label="Total Farmers"
          value={
            analytics?.users
              .farmers ||
            0
          }
          subtext={`${analytics?.users.experts || 0} Experts`}
          icon={
            Users
          }
          iconClass="bg-amber-50 text-amber-600"
        />

        <MetricCard
          label="Pending Experts"
          value={
            analytics
              ?.expertApprovals
              .pending ||
            0
          }
          subtext={`${analytics?.expertApprovals.approved || 0} approved`}
          icon={
            ShieldCheck
          }
          iconClass="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="User Role Distribution"
          description="All registered accounts by platform role."
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={
                userChartData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={
                  false
                }
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={
                  false
                }
                axisLine={
                  false
                }
              />

              <YAxis
                allowDecimals={
                  false
                }
                stroke="#94a3b8"
                fontSize={12}
                tickLine={
                  false
                }
                axisLine={
                  false
                }
              />

              <Tooltip
                cursor={{
                  fill:
                    "#f8fafc",
                }}
              />

              <Bar
                dataKey="count"
                fill="#10b981"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Consultation Status"
          description="Complete consultation workflow, including scheduled and cancelled requests."
        >
          <StatusPieChart
            data={
              consultationChartData
            }
          />
        </ChartCard>

        <ChartCard
          title="Marketplace Product Status"
          description="Matches the actual marketplace Product schema."
        >
          <StatusPieChart
            data={
              marketplaceChartData
            }
          />
        </ChartCard>

        <ChartCard
          title="Expert Account Status"
          description="Pending, approved, rejected and blocked Expert accounts."
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={
                expertApprovalData
              }
              layout="vertical"
              margin={{
                left:
                  12,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={
                  false
                }
                stroke="#e2e8f0"
              />

              <XAxis
                type="number"
                allowDecimals={
                  false
                }
                stroke="#94a3b8"
                fontSize={12}
                axisLine={
                  false
                }
              />

              <YAxis
                dataKey="name"
                type="category"
                width={80}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={
                  false
                }
                axisLine={
                  false
                }
              />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[
                  0,
                  8,
                  8,
                  0,
                ]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconClass,
}: {
  label: string;

  value: number;

  subtext:
    string;

  icon:
    typeof Tractor;

  iconClass:
    string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <h3 className="mt-1 text-2xl font-bold text-slate-800">
          {value}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {subtext}
        </p>
      </div>

      <div
        className={`rounded-xl p-3 ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;

  description:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>

      <div className="h-72 w-full">
        {children}
      </div>
    </section>
  );
}

function StatusPieChart({
  data,
}: {
  data: {
    name:
      string;

    value:
      number;
  }[];
}) {
  const nonEmptyData =
    data.filter(
      (
        item
      ) =>
        item.value >
        0
    );

  if (
    nonEmptyData.length ===
    0
  ) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        No data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={
            nonEmptyData
          }
          cx="50%"
          cy="46%"
          innerRadius={55}
          outerRadius={88}
          paddingAngle={4}
          dataKey="value"
        >
          {nonEmptyData.map(
            (
              item,
              index
            ) => (
              <Cell
                key={
                  item.name
                }
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />
            )
          )}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={42}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}