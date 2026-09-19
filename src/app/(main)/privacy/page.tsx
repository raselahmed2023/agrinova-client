import type { Metadata } from "next";
import Link from "next/link";

import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Cookie,
  Database,
  Eye,
  FileText,
  Handshake,
  HelpCircle,
  KeyRound,
  Lock,
  MessageSquareText,
  Scale,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AgriNova",
  description:
    "Learn how AgriNova collects, uses, shares, stores, and protects personal information across its farming, marketplace, consultation, community, and supply-chain services.",
};

const sectionLinks = [
  { id: "collection", label: "Information We Collect" },
  { id: "use", label: "How We Use Data" },
  { id: "sharing", label: "Sharing" },
  { id: "security", label: "Security" },
  { id: "consultations", label: "Consultations" },
  { id: "community", label: "Community" },
  { id: "payments", label: "Payments" },
  { id: "retention", label: "Retention" },
  { id: "rights", label: "Your Choices" },
  { id: "cookies", label: "Cookies" },
];

export default function PrivacyPolicyPage() {
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
            AgriNova Privacy
          </div>
        </div>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="bg-gradient-to-br from-[#043526] via-[#07513b] to-[#0b654a]">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy & Data Use
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/80 sm:text-base">
              This Privacy Policy explains what information AgriNova may
              collect, why we use it, when it may be shared, how long it may be
              retained, and the choices available to users across the platform.
            </p>

            <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-100/85">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                Last Updated: September 2026
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                Version 2.0
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
                Visitors & Registered Users
              </span>
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
                  How AgriNova Handles Information
                </h2>

                <p className="mt-1.5 max-w-4xl text-sm leading-6 text-slate-600">
                  We aim to collect only information that is reasonably needed
                  to operate the platform, provide requested services, protect
                  users, and improve AgriNova.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <p className="text-sm font-black text-amber-900">
                  Privacy Reminder
                </p>

                <p className="mt-1.5 text-xs leading-5 text-amber-800">
                  Avoid posting sensitive personal, financial, or farm
                  information publicly in Community posts or other public
                  areas unless you intend others to see it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRIVACY GRID
            Mobile: 1 column
            Tablet: 2 columns
            Desktop: 3 columns
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PrivacyCard
            id="collection"
            number="01"
            icon={<Eye className="h-5 w-5" />}
            title="Information We Collect"
          >
            <p>
              The information AgriNova collects depends on the features you use.
              It may include:
            </p>

            <BulletList
              items={[
                "Account information such as name, phone number, email address, profile image, and role.",
                "Farm or location information you choose to provide.",
                "Crop, product, marketplace, investment, or supply-chain information submitted through platform forms.",
                "Images, videos, comments, posts, consultation details, and other content you upload.",
                "Technical information such as device, browser, IP address, and service activity when available through our systems or providers.",
              ]}
            />
          </PrivacyCard>

          <PrivacyCard
            id="use"
            number="02"
            icon={<Database className="h-5 w-5" />}
            title="How We Use Information"
          >
            <p>
              AgriNova may use information to operate and improve the services
              you request.
            </p>

            <BulletList
              items={[
                "Create and manage user accounts and role-based access.",
                "Provide marketplace, consultation, community, investment, weather, and supply-chain features.",
                "Process requests, bookings, submissions, notifications, and support inquiries.",
                "Detect abuse, investigate security issues, and enforce platform rules.",
                "Maintain, analyze, and improve platform performance and user experience.",
              ]}
            />
          </PrivacyCard>

          <PrivacyCard
            id="sharing"
            number="03"
            icon={<Handshake className="h-5 w-5" />}
            title="When Information May Be Shared"
          >
            <p>
              AgriNova does not need to make every account detail public. Some
              information may be shared only when necessary for a feature or
              service.
            </p>

            <BulletList
              items={[
                "With Experts when a Farmer books or uses a consultation service.",
                "With buyers, sellers, or supply-chain participants when required to support an approved transaction or request.",
                "With service providers that help operate hosting, payments, communications, storage, analytics, or other platform functions.",
                "When required to comply with law, protect users, investigate abuse, or secure the platform.",
              ]}
            />
          </PrivacyCard>

          <PrivacyCard
            id="security"
            number="04"
            icon={<Lock className="h-5 w-5" />}
            title="Data Security"
          >
            <p>
              AgriNova uses reasonable technical and organizational safeguards
              designed to protect information from unauthorized access, loss,
              misuse, or alteration.
            </p>

            <p>
              No internet service or storage system can guarantee absolute
              security. Users should also protect their passwords, devices, and
              account sessions.
            </p>

            <MiniNotice>
              We intentionally avoid promising a specific encryption standard
              here unless that standard is verified across the production
              infrastructure.
            </MiniNotice>
          </PrivacyCard>

          <PrivacyCard
            id="consultations"
            number="05"
            icon={<MessageSquareText className="h-5 w-5" />}
            title="Expert Consultation Privacy"
          >
            <p>
              Information provided for a consultation may be shared with the
              selected Expert as necessary to provide the consultation.
            </p>

            <p>
              This can include crop details, uploaded images, the reported
              farming issue, schedule information, and other information the
              Farmer chooses to provide.
            </p>
          </PrivacyCard>

          <PrivacyCard
            id="community"
            number="06"
            icon={<UsersRound className="h-5 w-5" />}
            title="Community & Public Content"
          >
            <p>
              Community posts, comments, profile information, and uploaded media
              may be visible to other users depending on the feature.
            </p>

            <p>
              AgriNova may review or moderate public content for safety,
              security, abuse prevention, and enforcement of Community rules.
            </p>

            <MiniNotice>
              Do not include private phone numbers, payment information,
              passwords, or other sensitive data in public posts.
            </MiniNotice>
          </PrivacyCard>

          <PrivacyCard
            id="payments"
            number="07"
            icon={<WalletCards className="h-5 w-5" />}
            title="Payments & Transaction Data"
          >
            <p>
              When paid services are used, AgriNova may process or receive
              transaction-related information needed to confirm or manage the
              payment.
            </p>

            <p>
              Payment providers may separately collect payment credentials
              under their own privacy and security practices. AgriNova should
              not store full card or banking credentials unless the production
              payment architecture specifically requires and supports it.
            </p>
          </PrivacyCard>

          <PrivacyCard
            id="retention"
            number="08"
            icon={<Clock3 className="h-5 w-5" />}
            title="Data Retention"
          >
            <p>
              AgriNova may retain information for as long as reasonably
              necessary to provide services, maintain account and transaction
              records, resolve disputes, support security, or meet legal and
              operational requirements.
            </p>

            <p>
              Different categories of data may have different retention periods.
              Information may also be retained in backups for a limited period
              after deletion from active systems.
            </p>
          </PrivacyCard>

          <PrivacyCard
            id="rights"
            number="09"
            icon={<UserCheck className="h-5 w-5" />}
            title="Your Choices & Requests"
          >
            <p>
              Depending on the service and applicable requirements, users may
              request help with account information, corrections, access, or
              deletion.
            </p>

            <p>
              Some information may need to be retained where necessary for
              security, transactions, legal obligations, dispute resolution,
              or legitimate platform operations.
            </p>
          </PrivacyCard>

          <PrivacyCard
            id="cookies"
            number="10"
            icon={<Cookie className="h-5 w-5" />}
            title="Cookies & Similar Technologies"
          >
            <p>
              AgriNova and service providers may use cookies, browser storage,
              session identifiers, or similar technologies to support login,
              security, preferences, analytics, and platform functionality.
            </p>

            <p>
              Browser settings may allow users to block or delete some storage,
              but certain platform features may not function correctly if
              required technologies are disabled.
            </p>
          </PrivacyCard>

          {/* =================================================
              ACCOUNT SECURITY CARD
          ================================================== */}

          <section className="rounded-[24px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
              <KeyRound className="h-5 w-5" />
            </div>

            <p className="mt-5 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300">
              Account Security
            </p>

            <h2 className="mt-1 text-xl font-black">
              Protect Your Account
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Use a strong password, keep login credentials private, and sign
              out of shared devices. Contact AgriNova if you believe your
              account has been accessed without permission.
            </p>
          </section>

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
                  Privacy Support
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Questions or Data Requests?
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  For privacy questions, account-data requests, or concerns
                  about how information is handled, contact AgriNova through
                  the Contact page. Please avoid sending passwords or other
                  highly sensitive credentials in a support message.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-700 px-4 text-xs font-black text-white transition hover:bg-emerald-800"
                  >
                    Contact AgriNova
                  </Link>

                  <Link
                    href="/terms"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function PrivacyCard({
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
