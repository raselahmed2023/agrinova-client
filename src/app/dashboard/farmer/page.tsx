import Link from "next/link";
import {
  Bell,
  Bot,
  CloudSun,
  MessageSquareText,
  Plus,
  ShoppingBag,
  Sprout,
  Store,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    title: "My Farms",
    value: "0",
    description: "Registered farms",
    icon: Sprout,
    href: "/dashboard/farmer/farms",
  },
  {
    title: "Active Listings",
    value: "0",
    description: "Marketplace products",
    icon: ShoppingBag,
    href: "/dashboard/farmer/marketplace/listings",
  },
  {
    title: "Purchase Requests",
    value: "0",
    description: "Pending requests",
    icon: Store,
    href: "/dashboard/farmer/marketplace/requests",
  },
  {
    title: "Notifications",
    value: "0",
    description: "Unread notifications",
    icon: Bell,
    href: "/dashboard/farmer/notifications",
  },
];

const quickActions = [
  {
    title: "Add Farm",
    description: "Register a new farm",
    icon: Plus,
    href: "/dashboard/farmer/farms",
  },
  {
    title: "Detect Disease",
    description: "Analyze crop disease with AI",
    icon: Bot,
    href: "/dashboard/farmer/ai/disease-detection",
  },
  {
    title: "Sell Product",
    description: "Create marketplace listing",
    icon: Store,
    href: "/dashboard/farmer/marketplace/sell",
  },
  {
    title: "Consult Expert",
    description: "Get farming guidance",
    icon: MessageSquareText,
    href: "/dashboard/farmer/consultation",
  },
];

export default function FarmerDashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <section>
        <p className="text-sm font-medium text-[#477A5B]">
          Farmer Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome to AgriNova
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your farms, access smart agricultural tools, monitor weather,
          sell products and keep track of your farming activities from one
          place.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {item.description}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Weather + Finance */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Weather */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Weather Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Weather information for your farm
              </p>
            </div>

            <Link
              href="/dashboard/farmer/weather"
              className="text-sm font-semibold text-[#0B6B4A] hover:underline"
            >
              View Weather
            </Link>
          </div>

          <div className="mt-6 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0B513D] shadow-sm">
              <CloudSun className="h-6 w-6" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              Weather data will appear here
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Add a farm first. Weather information can then be shown using
              your farm location.
            </p>

            <Link
              href="/dashboard/farmer/farms"
              className="mt-4 rounded-lg bg-[#0B513D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#084330]"
            >
              Add Farm
            </Link>
          </div>
        </div>

        {/* Finance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Finance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Financial summary
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
              <WalletCards className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Total Income
                </span>

                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>

              <p className="mt-2 text-xl font-bold text-slate-900">
                ৳0
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Total Expense
                </span>

                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>

              <p className="mt-2 text-xl font-bold text-slate-900">
                ৳0
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-600">
                Net Profit
              </span>

              <span className="text-lg font-bold text-[#0B513D]">
                ৳0
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/farmer/finance"
            className="mt-5 block text-center text-sm font-semibold text-[#0B6B4A] hover:underline"
          >
            View Finance
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used farmer tools
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#9DC5AA] hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF6F0] text-[#0B513D] transition group-hover:bg-[#0B513D] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Notifications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest updates and alerts
              </p>
            </div>

            <Link
              href="/dashboard/farmer/notifications"
              className="text-sm font-semibold text-[#0B6B4A] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-6 flex min-h-36 flex-col items-center justify-center text-center">
            <Bell className="h-7 w-7 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No notifications yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Important farming updates will appear here.
            </p>
          </div>
        </div>

        {/* Marketplace */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Marketplace Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Listings and purchase requests
              </p>
            </div>

            <Link
              href="/dashboard/farmer/marketplace"
              className="text-sm font-semibold text-[#0B6B4A] hover:underline"
            >
              Browse
            </Link>
          </div>

          <div className="mt-6 flex min-h-36 flex-col items-center justify-center text-center">
            <ShoppingBag className="h-7 w-7 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No marketplace activity
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your listings and purchase requests will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}