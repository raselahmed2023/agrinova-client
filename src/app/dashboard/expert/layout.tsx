import type { ReactNode } from "react";

import ExpertSidebar from "@/components/expert/ExpertSidebar";

export default function ExpertLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <ExpertSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}