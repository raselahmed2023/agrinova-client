import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AgriNova",
  description: "Learn how AgriNova protects farmer data, proprietary field telemetry, and personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#063B2B] to-[#0D5941] p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/10 mb-10">
          <div className="flex items-center gap-3 text-emerald-300 text-sm font-medium mb-3">
            <ShieldCheck className="h-5 w-5" />
            <span>Official Policy & Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            At AgriNova, your trust and the confidentiality of your agricultural data are paramount. We are committed to transparency in how we collect, store, and utilize data across our smart farming platform.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-emerald-200">
            <span>Last Updated: September 2026</span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span>Jurisdiction: Bangladesh & Global Agritech Standards</span>
          </div>
        </div>

        {/* Policy Content */}
        <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-10 text-slate-700">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 mb-3">
              We collect information that allows us to deliver high-accuracy crop diagnostics, weather alerts, marketplace services, and agronomist consultations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li><strong>Account Credentials:</strong> Name, phone number, email address, farm location, and credentials.</li>
              <li><strong>Field & Agronomic Telemetry:</strong> Crop varieties, plot acreage, planting schedules, soil parameters, and harvest timelines.</li>
              <li><strong>AI Diagnostic Inputs:</strong> Leaf and pest imagery uploaded for AI disease detection and historical diagnostic reports.</li>
              <li><strong>Marketplace Data:</strong> Product listings, pricing, inventory quantities, purchase inquiries, and transaction confirmations.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. How We Safeguard Your Data</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 mb-3">
              Your field telemetry and economic data remain strictly yours. We enforce state-of-the-art security practices:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>End-to-end encryption in transit (TLS 1.3) and at rest (AES-256).</li>
              <li>Strict tenant isolation ensuring no competitor or third party can access your private yield or pricing records.</li>
              <li>Anonymized aggregate modeling for training AI diagnostic tools with explicit consent only.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Expert Consultation Privacy</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Direct discussions, field notes, and diagnosis requests shared with verified agricultural experts remain confidential and accessible solely by you and your designated consulting specialist.
            </p>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Questions or Data Requests?</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, wish to request an export of your farm data, or exercise your data rights, please contact our Data Protection Officer at{" "}
              <a href="mailto:privacy@agrinova.io" className="font-medium text-emerald-600 hover:underline">
                privacy@agrinova.io
              </a>{" "}
              or via our{" "}
              <Link href="/contact" className="font-medium text-emerald-600 hover:underline">
                Support Desk
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
