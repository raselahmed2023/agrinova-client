import Link from "next/link";
import { QrCode, Share2, AtSign } from "lucide-react";

const productLinks = [
  { label: "Crop Management", href: "#" },
  { label: "Disease Detection", href: "#" },
  { label: "Soil Health", href: "#" },
  { label: "Pricing Plans", href: "#" },
];

const resourceLinks = [
  { label: "Farmer Guides", href: "#" },
  { label: "Market Trends", href: "#" },
  { label: "API Docs", href: "#" },
  { label: "Community Forum", href: "#" },
];

const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Expert Consultation", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#e8f0fc]">
      <div className="w-full px-8 py-12 lg:px-10">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-[290px]">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-4 w-4 rotate-45 bg-[#003c2e]" />

              <span className="text-lg font-bold text-[#003c2e]">
                AgriNova
              </span>
            </Link>

            <p className="mt-4 text-sm leading-5 text-slate-600">
              Empowering farmers with modern technology and expert advice to
              ensure food security and sustainable growth across the globe.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <SocialButton ariaLabel="QR Code">
                <QrCode size={13} />
              </SocialButton>

              <SocialButton ariaLabel="Share">
                <Share2 size={13} />
              </SocialButton>

              <SocialButton ariaLabel="Email">
                <AtSign size={13} />
              </SocialButton>
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-300 pt-9">
          <div className="flex flex-col gap-4 text-[11px] text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>© 2026 AgriNova Solutions Ltd. All rights reserved.</p>

            <div className="flex items-center gap-7">
              <Link
                href="#"
                className="transition-colors hover:text-[#003c2e]"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-[#003c2e]"
              >
                Cookies
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-[#003c2e]"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#003c2e]">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-xs text-slate-600 transition-colors hover:text-[#003c2e]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type SocialButtonProps = {
  children: React.ReactNode;
  ariaLabel: string;
};

function SocialButton({
  children,
  ariaLabel,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003c2e] text-white transition hover:bg-[#075c46]"
    >
      {children}
    </button>
  );
}