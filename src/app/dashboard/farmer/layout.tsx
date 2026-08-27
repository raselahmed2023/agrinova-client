"use client";

import FarmerSidebar from "@/components/dashboard/FarmerSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function FarmerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <FarmerSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="ml-3 hidden sm:block lg:ml-0">
              <p className="text-sm font-semibold text-slate-900">
                Farmer Dashboard
              </p>

              <p className="text-xs text-slate-400">
                Manage your farming activities
              </p>
            </div>
          </header>

          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
