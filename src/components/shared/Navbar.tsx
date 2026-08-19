import Link from "next/link";

const navLinks = [
  { label: "MarketPlace", href: "/" },
  { label: "Consultant", href: "/" },
  { label: "Blog", href: "/" },
  { label: "Contact", href: "/" },
];

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-bold text-[#063B2B]"
        >
          AgriNova
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-800 transition-colors hover:text-[#063B2B]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg bg-[#063B2B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
            >
              Login
            </Link>

            <Link
              href="/register?role=expert"
              className="hidden rounded-lg bg-[#D8E9DA] px-5 py-2.5 text-sm font-semibold text-[#315B45] transition hover:bg-[#C9DFC9] sm:inline-flex"
            >
              Join as Expert
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}