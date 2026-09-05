import type { Metadata } from "next";
import Link from "next/link";
import { Scale, CheckCircle2, AlertTriangle, HelpCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | AgriNova",
  description: "Terms and conditions governing the usage of AgriNova platform, marketplace, and agronomy services.",
};

export default function TermsOfServicePage() {
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
            <Scale className="h-5 w-5" />
            <span>Platform Agreement & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-emerald-100/80 text-sm sm:text-base max-w-2xl leading-relaxed">
            Welcome to AgriNova. By accessing or using our website, digital advisory tools, AI diagnostics, and marketplace services, you agree to comply with the terms set forth below.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-emerald-200">
            <span>Effective Date: September 2026</span>
            <span>•</span>
            <span>Version 1.8</span>
            <span>•</span>
            <span>Applies to all registered Farmers, Experts & Visitors</span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-10 text-slate-700">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Account Registration & Roles</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 mb-3">
              Users must provide accurate, verified information during account creation. AgriNova supports distinct roles:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li><strong>Farmers:</strong> Gain access to farm tracking, field records, AI diagnostic engines, weather alerts, and crop trade.</li>
              <li><strong>Agricultural Experts:</strong> Must provide legitimate credentials, academic background, and relevant certification subject to review.</li>
              <li><strong>Administrators:</strong> Govern platform security, marketplace integrity, and verification workflows.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. AI Diagnosis & Agronomy Disclaimer</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              AgriNova’s AI models provide advisory predictions with high statistical accuracy (over 98% in tested datasets). However, AI recommendations should be treated as guidance tools. Local meteorological conditions, unforeseen soil pathogens, and microclimates must be verified with on-the-ground visual assessments or certified agronomists before deploying extensive chemical treatments.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Marketplace Conduct & Fair Trade</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 mb-3">
              Sellers listing crops, seeds, organic fertilizers, or equipment must ensure:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>Goods conform strictly to stated quantity, grade, and harvest date.</li>
              <li>No counterfeit, prohibited, or hazardous agrochemicals are marketed.</li>
              <li>Pricing is transparent, with all regional levies and logistics clarified.</li>
            </ul>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Assistance & Inquiries</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have inquiries regarding these terms, contract agreements, or corporate licensing, reach out to our legal department at{" "}
              <a href="mailto:legal@agrinova.io" className="font-medium text-emerald-600 hover:underline">
                legal@agrinova.io
              </a>{" "}
              or browse our{" "}
              <Link href="/contact" className="font-medium text-emerald-600 hover:underline">
                Contact Desk
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
