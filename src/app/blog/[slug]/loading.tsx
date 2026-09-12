import {
  Loader2,
} from "lucide-react";

export default function BlogArticleLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <div
        role="status"
        aria-label="Loading article"
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-white shadow-lg"
      >
        <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />
      </div>
    </div>
  );
}