import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sprout,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | AgriNova",
  description:
    "Contact AgriNova for platform support, marketplace assistance, agricultural expert services, and general inquiries.",
};

const contactMethods = [
  {
    title: "Email Support",
    description:
      "For general questions, account support, marketplace issues, and platform assistance.",
    value: "support@agrinova.io",
    href: "mailto:support@agrinova.io",
    icon: Mail,
  },
  {
    title: "Call Support",
    description:
      "Speak with our support team regarding urgent platform-related inquiries.",
    value: "+880 1785-473355",
    href: "tel:+8801785473355",
    icon: Phone,
  },
  {
    title: "Our Location",
    description:
      "AgriNova operates from Bangladesh and supports modern agricultural services digitally.",
    value: "Dhaka, Bangladesh",
    href: null,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-[-180px] top-[80px] h-[420px] w-[420px] rounded-full bg-emerald-300/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-170px] top-[500px] h-[420px] w-[420px] rounded-full bg-teal-300/20 blur-[130px]" />

      <section className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Back */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_32%),linear-gradient(135deg,#03261c_0%,#074432_48%,#0b5d42_100%)] p-1 shadow-[0_30px_80px_rgba(6,47,36,0.20)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 top-8 h-60 w-60 rounded-full bg-emerald-300/10 blur-3xl" />
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-200/10 blur-3xl" />
            </div>

            <div className="relative rounded-[28px] border border-white/15 bg-white/10 px-6 py-9 text-white backdrop-blur-xl sm:px-9 sm:py-10 lg:px-12 lg:py-11">
              <div className="grid gap-8 xl:grid-cols-[1.15fr_.85fr] xl:items-center">
                <div className="max-w-3xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100 backdrop-blur">
                    <MessageSquareText className="h-4 w-4" />
                    AgriNova Contact Center
                  </div>

                  <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                    How can we help?
                  </h1>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                    Whether you need help with your account, marketplace,
                    agricultural consultation, investment, or another AgriNova
                    service, our support channels are available to assist you.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="mailto:support@agrinova.io"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#063B2B] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50"
                    >
                      <Mail className="h-4 w-4" />
                      Email Us
                    </a>

                    <Link
                      href="/support"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition duration-200 hover:bg-white/15"
                    >
                      <Headphones className="h-4 w-4" />
                      Support Center
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                      Account Help
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      Login & Profile
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                      Support for access, profiles, authentication, and role-related issues.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                      Platform Help
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      Marketplace & Services
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                      Assistance with Marketplace, Community, Consultation, Investment, and support tools.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100/75">
                      Security
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      Safe Support
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/75">
                      Never send passwords, access tokens, or payment credentials in support messages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contactMethods.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className="group h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5 sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 min-h-[60px] text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <span>{item.value}</span>

                    {item.href && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <a key={item.title} href={item.href}>
                    {content}
                  </a>
                );
              }

              return <div key={item.title}>{content}</div>;
            })}
          </div>

          {/* Main Information Section */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left */}
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Sprout className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
                    Contact Categories
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    What can we assist you with?
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <SupportItem
                  title="Account & Authentication"
                  description="Login, registration, account access, profile, password, and role-related assistance."
                />

                <SupportItem
                  title="Marketplace"
                  description="Product listings, seller orders, buyer orders, cart, checkout, and marketplace issues."
                />

                <SupportItem
                  title="Expert Consultation"
                  description="Agricultural expert profiles, bookings, consultation requests, scheduling, and consultation support."
                />

                <SupportItem
                  title="Investment"
                  description="Agricultural projects, investor information, project details, and investment platform support."
                />

                <SupportItem
                  title="Community & Blog"
                  description="Community posts, comments, profiles, expert articles, and content-related questions."
                />

                <SupportItem
                  title="Technical Support"
                  description="Report errors, broken pages, unexpected behavior, uploads, or other technical problems."
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Hours */}
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Support Information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Send us an email anytime. Include enough information about
                      your issue so our team can understand the problem and
                      assist you efficiently.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-[28px] bg-[#062E22] p-7 text-white shadow-xl shadow-emerald-950/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  Protect your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-emerald-50/70">
                  Never send your password, access token, authentication code,
                  payment password, or other sensitive credentials through
                  email or public messages.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 overflow-hidden rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Looking for agricultural advice?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Browse available agricultural experts and connect with a
                  specialist for farming, crop, soil, pest, or disease-related
                  assistance.
                </p>
              </div>

              <Link
                href="/consultant"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#07523B] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#063B2B]"
              >
                Find an Expert
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SupportItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-emerald-100 hover:bg-emerald-50/40">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}