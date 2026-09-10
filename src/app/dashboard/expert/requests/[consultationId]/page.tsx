"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function ConsultationRequestDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams?.consultationId) {
      router.replace(
        `/dashboard/expert/consultations/${resolvedParams.consultationId}`
      );
    } else {
      router.replace("/dashboard/expert/consultations");
    }
  }, [router, resolvedParams]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-slate-600">Redirecting to consultation...</p>
      </div>
    </div>
  );
}
