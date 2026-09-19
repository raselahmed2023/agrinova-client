"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  BriefcaseBusiness,
  Headphones,
  Home,
  Leaf,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sprout,
  UserPlus,
  Users,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const exploreLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
  },
  {
    label: "Investment",
    href: "/investment",
    icon: BriefcaseBusiness,
  },
  {
    label: "Expert Consultation",
    href: "/consultant",
    icon: Users,
  },
];

const resourceLinks = [
  {
    label: "Farming Guides & Blog",
    href: "/blog",
    icon: BookOpen,
  },
  {
    label: "Support Center",
    href: "/support",
    icon: Headphones,
  },
  {
    label: "Become an Expert",
    href: "/register/expert",
    icon: Sprout,
  },
];

const accountLinks = [
  {
    label: "Create Account",
    href: "/register",
    icon: UserPlus,
  },
  {
    label: "Sign In",
    href: "/login",
    icon: LogIn,
  },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    icon: FaXTwitter,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#031912] text-white">
      {/* background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-44 right-0 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      
        {/* main footer */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.3fr_2fr] lg:gap-20">
          {/* brand */}
          <div>
            <Link
              href="/"
              className="inline-flex rounded-2xl bg-white px-4 py-2 shadow-lg shadow-black/10"
            >
              <Image
                src="/AgriNova-Logo.png"
                alt="AgriNova"
                width={150}
                height={44}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              AgriNova connects farmers, agricultural experts, technology,
              investment opportunities and local commerce through one modern
              digital agriculture platform.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* public navigation */}
          <div className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Explore" links={exploreLinks} />

            <FooterColumn title="Resources" links={resourceLinks} />

            <FooterColumn title="Account" links={accountLinks} />
          </div>
        </div>
        
        {/* bottom */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="text-xs leading-6 text-slate-500">
            © {new Date().getFullYear()} AgriNova Technologies Ltd.
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">
              Smarter technology for modern agriculture.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="text-xs font-medium text-slate-400 transition hover:text-emerald-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs font-medium text-slate-400 transition hover:text-emerald-300"
            >
              Terms of Service
            </Link>

            <Link
              href="/support"
              className="text-xs font-medium text-slate-400 transition hover:text-emerald-300"
            >
              Support
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition duration-200 hover:-translate-y-1 hover:bg-emerald-400 hover:text-[#031912]"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
        {title}
      </h3>

      <ul className="mt-5 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-2.5 rounded-lg py-2 text-sm text-slate-400 transition hover:text-white"
              >
                <Icon className="h-4 w-4 text-slate-600 transition group-hover:text-emerald-400" />

                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  last = false,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  href?: string;
  last?: boolean;
}) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-200">
          {value}
        </p>
      </div>
    </>
  );

  return (
    <div
      className={`flex items-center gap-4 px-5 py-5 sm:px-6 ${
        !last ? "border-b border-white/10 sm:border-b-0 sm:border-r" : ""
      }`}
    >
      {href ? (
        <a
          href={href}
          className="flex min-w-0 items-center gap-4 transition hover:opacity-80"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}