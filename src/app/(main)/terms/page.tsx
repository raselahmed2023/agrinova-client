import type { Metadata } from "next";
import Link from "next/link";

import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Bot,
  CheckCircle2,
  FileText,
  Gavel,
  Handshake,
  HelpCircle,
  LockKeyhole,
  Scale,
  ShieldCheck,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | AgriNova",
  description:
    "Terms governing the use of AgriNova accounts, marketplace, agricultural advisory, consultation, community, supply-chain and related platform services.",
};

const sectionLinks = [
  { id: "acceptance", label: "Acceptance" },
  { id: "accounts", label: "Accounts" },
  { id: "advisory", label: "AI & Advisory" },
  { id: "marketplace", label: "Marketplace" },
  { id: "consultations", label: "Consultations" },
  { id: "supply-chain", label: "Supply Chain" },
  { id: "community", label: "Community" },
  { id: "payments", label: "Payments" },
  { id: "platform-use", label: "Acceptable Use" },
  { id: "liability", label: "Availability" },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#f5f7f6]">
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            AgriNova Legal
          </div>
        </div>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_32%),linear-gradient(135deg,#03261c_0%,#074432_48%,#0b5d42_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="grid gap-8 xl:grid-cols-[1.15fr_.85fr] xl:items-center">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-50">
                  <Scale className="h-3.5 w-3.5" />
                  Platform Agreement
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                  Terms of Service
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                  These Terms explain the rules for using AgriNova&apos;s accounts,
                  marketplace, agricultural advisory tools, expert consultations,
                  community, supply-chain services, payments, and related platform
                  features.
                </p>

                <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-100/90">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
                    Effective: September 2026
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
                    Version 2.0
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
                    Visitors & Registered Users
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                    Coverage
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    Core Platform Rules
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                    Applies to Marketplace, Community, Consultations, Supply Chain, and related services.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                    Compliance
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    Account & Role Use
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                    Users must provide accurate information and respect access restrictions.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                    Important
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    Read Before Use
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                    Continued use of AgriNova means acceptance of these Terms and future updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK NAV
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectionLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-[11px] font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-7 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  AgriNova Platform Terms
                </h2>

                <p className="mt-1.5 max-w-4xl text-sm leading-6 text-slate-600">
                  Please read these Terms carefully before using AgriNova. By
                  accessing or using the platform, you agree to these Terms and
                  any policies expressly incorporated by reference.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <p className="text-sm font-black text-amber-900">
                  Important Notice
                </p>

                <p className="mt-1.5 text-xs leading-5 text-amber-800">
                  Agricultural, AI, weather, marketplace, payment, and other
                  platform information may involve uncertainty. Important
                  decisions should be reviewed independently where appropriate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TERMS GRID
            Mobile: 1 column
            Tablet: 2 columns
            Desktop: 3 columns
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <TermsCard
            id="acceptance"
            number="01"
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Acceptance of Terms"
          >
            <p>
              By accessing, registering for, or using AgriNova, you agree to
              comply with these Terms. If you do not agree, you should not use
              the platform.
            </p>

            <p>
              AgriNova may update these Terms when services, operational
              practices, or legal requirements change. Updated Terms apply from
              the effective date shown on this page.
            </p>
          </TermsCard>

          <TermsCard
            id="accounts"
            number="02"
            icon={<UsersRound className="h-5 w-5" />}
            title="Accounts, Roles & Security"
          >
            <p>
              Users must provide accurate account information and protect their
              login credentials.
            </p>

            <BulletList
              items={[
                "Farmers may access enabled farmer tools and services.",
                "Experts may be required to provide qualifications and verification information.",
                "Administrators manage platform operations, verification, and moderation.",
                "Users must not impersonate others or bypass role restrictions.",
              ]}
            />
          </TermsCard>

          <TermsCard
            id="advisory"
            number="03"
            icon={<Bot className="h-5 w-5" />}
            title="AI & Agricultural Advisory"
          >
            <p>
              AgriNova may provide AI-assisted crop analysis, disease
              detection, weather information, and agricultural guidance.
            </p>

            <p>
              These tools support decision-making but do not guarantee a
              diagnosis, yield, treatment outcome, weather condition, or
              commercial result.
            </p>

            <MiniNotice>
              Use qualified agricultural professionals when an on-site or
              specialist assessment is reasonably required.
            </MiniNotice>
          </TermsCard>

          <TermsCard
            id="marketplace"
            number="04"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Marketplace Listings"
          >
            <p>
              Sellers are responsible for accurate, lawful, and non-misleading
              listings, including price, quantity, condition, availability, and
              product details.
            </p>

            <BulletList
              items={[
                "No counterfeit, stolen, prohibited, or unsafe goods.",
                "No false quality, origin, condition, or pricing information.",
                "AgriNova may remove listings that violate platform rules.",
              ]}
            />
          </TermsCard>

          <TermsCard
            id="consultations"
            number="05"
            icon={<BadgeCheck className="h-5 w-5" />}
            title="Expert Consultations"
          >
            <p>
              Farmers may book consultations with approved agricultural
              Experts. Availability, schedule, fee, duration, payment
              requirements, and meeting format may vary.
            </p>

            <p>
              Recommendations are based on information available to the Expert
              at the time of consultation. Farmers remain responsible for
              deciding whether and how to apply them.
            </p>
          </TermsCard>

          <TermsCard
            id="supply-chain"
            number="06"
            icon={<Handshake className="h-5 w-5" />}
            title="Supply Chain & Buyer Connections"
          >
            <p>
              AgriNova may connect approved farm produce with suitable buyers,
              businesses, or industries.
            </p>

            <p>
              A submission does not guarantee acceptance, buyer matching,
              purchase, final price, delivery arrangement, or transaction
              completion.
            </p>

            <MiniNotice>
              Unless a specific transaction states otherwise, AgriNova acts as
              a platform and coordination bridge between participants.
            </MiniNotice>
          </TermsCard>

          <TermsCard
            id="community"
            number="07"
            icon={<UsersRound className="h-5 w-5" />}
            title="Community Content"
          >
            <p>
              Users are responsible for posts, comments, images, and other
              content they submit.
            </p>

            <p>
              AgriNova may review, restrict, remove, or moderate content that is
              unlawful, abusive, deceptive, sexually explicit, threatening,
              harassing, or otherwise inappropriate.
            </p>
          </TermsCard>

          <TermsCard
            id="payments"
            number="08"
            icon={<Banknote className="h-5 w-5" />}
            title="Payments, Fees & Refunds"
          >
            <p>
              Certain AgriNova services may require payment. Applicable prices
              and payment requirements should be shown before confirmation.
            </p>

            <p>
              Refunds, cancellations, and payment disputes depend on the
              relevant service, transaction status, payment-provider rules, and
              any applicable refund policy.
            </p>
          </TermsCard>

          <TermsCard
            id="platform-use"
            number="09"
            icon={<LockKeyhole className="h-5 w-5" />}
            title="Acceptable Use & Security"
          >
            <BulletList
              items={[
                "No unauthorized account, API, or dashboard access.",
                "No malicious code, abusive automation, or security interference.",
                "No fraud, harassment, unlawful transactions, or deceptive activity.",
                "No bypassing role, moderation, payment, or security controls.",
              ]}
            />
          </TermsCard>

          <TermsCard
            id="liability"
            number="10"
            icon={<Gavel className="h-5 w-5" />}
            title="Availability & Third Parties"
          >
            <p>
              AgriNova may rely on third-party services such as payment
              processors, hosting, maps, weather data, image services, and
              video-conferencing providers.
            </p>

            <p>
              The platform may occasionally be unavailable because of
              maintenance, outages, security work, updates, or other technical
              issues.
            </p>
          </TermsCard>

          {/* =================================================
              CONTACT CARD
          ================================================== */}

          <section className="md:col-span-2 xl:col-span-2 rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <HelpCircle className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  Need Help?
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Questions About These Terms?
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  For general questions about these Terms or AgriNova
                  services, contact us through the Contact page. For
                  privacy-related matters, please also review the Privacy
                  Policy.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-xs font-black text-white transition hover:bg-emerald-800"
                  >
                    Contact AgriNova
                  </Link>

                  <Link
                    href="/privacy"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              VERSION CARD
          ================================================== */}

          <section className="rounded-[24px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
              <Scale className="h-5 w-5" />
            </div>

            <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300">
              Current Terms
            </p>

            <h2 className="mt-1 text-xl font-black">
              Version 2.0
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Effective September 2026. Future revisions should update the
              version and effective date shown on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function TermsCard({
  id,
  number,
  icon,
  title,
  children,
}: {
  id: string;
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_14px_35px_-30px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_20px_42px_-30px_rgba(4,120,87,0.28)] sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <span className="text-4xl font-black leading-none text-slate-100">
          {number}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">
        {title}
      </h2>

      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </section>
  );
}

function MiniNotice({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
      <div className="flex gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

        <p className="text-xs font-semibold leading-5 text-amber-800">
          {children}
        </p>
      </div>
    </div>
  );
}

function BulletList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
