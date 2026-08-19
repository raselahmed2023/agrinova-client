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
    <footer className="border-t border-slate-200 bg-[#eaf2ff]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-4 w-4 rotate-45 bg-emerald-950" />
              <span className="text-xl font-bold text-emerald-950">
                AgriNova
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Empowering farmers with modern technology and expert advice to
              ensure food security and sustainable growth across the globe.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <SocialButton ariaLabel="QR Code">
                <QrCode size={15} />
              </SocialButton>

              <SocialButton ariaLabel="Share">
                <Share2 size={15} />
              </SocialButton>

              <SocialButton ariaLabel="Email">
                <AtSign size={15} />
              </SocialButton>
            </div>
          </div>

          {/* Product */}
          <FooterColumn title="Product" links={productLinks} />

          {/* Resources */}
          <FooterColumn title="Resources" links={resourceLinks} />

          {/* Support */}
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-slate-300 pt-10">
          <div className="flex flex-col gap-5 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>© 2026 AgriNova Solutions Ltd. All rights reserved.</p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="#"
                className="transition-colors hover:text-emerald-950"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-emerald-950"
              >
                Cookies
              </Link>

              <Link
                href="#"
                className="transition-colors hover:text-emerald-950"
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

