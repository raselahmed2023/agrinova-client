"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConsultationRequestsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/expert/consultations");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-slate-600">Redirecting to consultations...</p>
      </div>
    </div>
  );
}
