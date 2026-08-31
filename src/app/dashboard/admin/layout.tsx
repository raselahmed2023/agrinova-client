"use client";

import type { ReactNode } from "react";

import {
  Menu,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="min-w-0 flex-1">
          {/* Mobile / Tablet Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-sm font-bold text-emerald-950">
                  AgriNova
                </h2>

                <p className="text-[11px] text-slate-400">
                  Admin Panel
                </p>
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </header>

          {/* Page */}
          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}