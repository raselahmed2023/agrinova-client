import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

type UnderConstructionProps = {
  title: string;
  description?: string;
};

export default function UnderConstruction({
  title,
  description = "We're currently working on this feature. Please check back soon.",
}: UnderConstructionProps) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f0fc]">
          <Construction className="h-10 w-10 text-[#063B2B]" />
        </div>


        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#063B2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          This page is currently under construction.
        </p>
      </div>
    </main>
  );
}