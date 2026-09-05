"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import {
  FaLinkedinIn,
  FaXTwitter,
  FaFacebookF,
} from "react-icons/fa6";

const platformLinks = [
  { label: "Crop Disease Detection", href: "/dashboard/farmer/ai/disease-detection", badge: "AI" },
  { label: "Crop Recommendation", href: "/dashboard/farmer/ai/crop-recommendation", badge: "AI" },
  { label: "AI Farming Assistant", href: "/dashboard/farmer/ai/assistant" },
  { label: "Hyper-local Weather", href: "/dashboard/farmer/weather" },
  { label: "Farm Management", href: "/dashboard/farmer/farms" },
];

const marketplaceLinks = [
  { label: "Browse Marketplace", href: "/dashboard/farmer/marketplace" },
  { label: "Sell Harvest & Equipment", href: "/dashboard/farmer/marketplace/sell" },
  { label: "My Active Listings", href: "/dashboard/farmer/marketplace/listings" },
  { label: "Purchase Inquiries", href: "/dashboard/farmer/marketplace/requests" },
  { label: "Farm Cost Tracking", href: "/dashboard/farmer/finance" },
];

const advisoryLinks = [
  { label: "Expert Consultation", href: "/consultant" },
  { label: "My Consultations", href: "/dashboard/farmer/consultation" },
  { label: "Join as Verified Expert", href: "/register?role=expert", badge: "Hiring" },
  { label: "Farming Guides & Blog", href: "/blog" },
  { label: "Contact & Support", href: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "X / Twitter", href: "https://twitter.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#041a13] text-slate-300">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />


      {/* Main Footer Body */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Overview Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-sm transition hover:opacity-90">
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={135}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              AgriNova is an end-to-end digital agriculture ecosystem uniting precision AI crop diagnostics, weather intelligence, agronomist consultation, and local marketplace commerce.
            </p>

            {/* Live Operational Status */}
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-800/60 bg-[#06261d] px-3.5 py-1.5 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All AI & Platform Services Operational</span>
            </div>

            {/* Social Links */}
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Connect With Us
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/60 bg-[#072a20] text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-emerald-600 hover:text-white hover:shadow-md hover:shadow-emerald-900/50"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
            {/* Column 1: AI & Tools */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                AI & Tools
              </h4>
              <ul className="mt-4 space-y-3">
                {platformLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Marketplace */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Marketplace
              </h4>
              <ul className="mt-4 space-y-3">
                {marketplaceLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Advisory */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Advisory
              </h4>
              <ul className="mt-4 space-y-3">
                {advisoryLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Help Ribbon */}
        <div className="mt-12 rounded-2xl border border-emerald-900/50 bg-[#06241b] p-6 sm:p-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-300/70">Official Email</p>
                <a
                  href="mailto:support@agrinova.io"
                  className="text-sm font-semibold text-white transition hover:text-emerald-300"
                >
                  support@agrinova.io
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-300/70">Farmer Support Hotline</p>
                <a
                  href="tel:+8808002474668"
                  className="text-sm font-semibold text-white transition hover:text-emerald-300"
                >
                  +880 1785-473355
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-300/70">Central Office</p>
                <p className="text-sm font-semibold text-white">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/40 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-300/70">Operating Hours</p>
                <p className="text-sm font-semibold text-white">
                  Mon – Sat: 8 AM – 8 PM BST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-emerald-900/40 pt-8 sm:flex-row">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} AgriNova Technologies Ltd. All rights reserved.</p>
            <span className="hidden sm:inline text-emerald-800">•</span>
            <span className="text-slate-400">
              Sustainable Agriculture & Digital Farming Infrastructure
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <Link
              href="/privacy"
              className="text-slate-400 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-400 transition hover:text-white"
            >
              Terms of Service
            </Link>


            {/* Back to Top button */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-800/60 bg-[#06241b] text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}