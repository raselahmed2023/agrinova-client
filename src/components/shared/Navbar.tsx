"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

const navLinks = [
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Investment",
    href: "/investment",
  },
  {
    label: "Consultant",
    href: "/consultant",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "B2B Support",
    href: "/support",
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();
  const { totalItems } = useCart();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const role = user?.role?.toUpperCase();

  const isFarmer = role === "FARMER";
  const isExpert = role === "EXPERT";
  const isAdmin = role === "ADMIN";

  /*
   * Close menus whenever the route changes.
   */
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  /*
   * Prevent background scrolling while mobile menu is open.
   */
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /*
   * Determine dashboard according to user's role.
   */
  const getDashboardPath = () => {
    if (isAdmin) {
      return "/dashboard/admin";
    }

    if (isExpert) {
      return "/dashboard/expert";
    }

    return "/dashboard/farmer";
  };

  /*
   * Generate user initials.
   */
  const getInitials = (name?: string | null) => {
    if (!name) {
      return "U";
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  };


  const isNavLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  /*
   * Logout.
   */
  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setProfileOpen(false);
      setMobileOpen(false);

      router.push("/");
      router.refresh();
    }
  };

  const closeMenus = () => {
    setProfileOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
   
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={135}
              height={45}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active = isNavLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-[#063B2B]"
                      : "text-gray-700 hover:text-[#063B2B]"
                  }`}
                >
                  {link.label}

                  {/* Active route indicator */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0B513D]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 lg:flex">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <div className="relative">

                {/* Profile button */}
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (current) => !current
                    )
                  }
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8E9DA] text-sm font-bold text-[#063B2B]">
                    {getInitials(user.name)}
                  </div>

                  <div className="hidden max-w-32 text-left xl:block">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                      {role?.toLowerCase()}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <ProfileDropdown
                    user={user}
                    role={role}
                    isFarmer={isFarmer}
                    totalItems={totalItems}
                    dashboardPath={getDashboardPath()}
                    onClose={() =>
                      setProfileOpen(false)
                    }
                    onLogout={handleLogout}
                  />
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl bg-[#063B2B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
                >
                  Login
                </Link>

                <Link
                  href="/register?role=expert"
                  className="rounded-xl bg-[#D8E9DA] px-5 py-2.5 text-sm font-semibold text-[#315B45] transition hover:bg-[#cde1d0]"
                >
                  Join as Expert
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">

            {/* Mobile cart */}
            {user && (
              <Link
                href="/cart"
                onClick={closeMenus}
                aria-label="Cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5" />

                {isFarmer &&
                  totalItems > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                      {totalItems > 99
                        ? "99+"
                        : totalItems}
                    </span>
                  )}
              </Link>
            )}

            {/* Mobile login */}
            {!user && !isPending && (
              <Link
                href="/login"
                className="rounded-lg bg-[#063B2B] px-4 py-2 text-sm font-semibold text-white"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={mobileOpen}
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />

          {/* Menu panel */}
          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-200 bg-white shadow-xl lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

              {/* Main navigation */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active =
                    isNavLinkActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      aria-current={
                        active ? "page" : undefined
                      }
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-[#EAF4ED] text-[#0B513D]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{link.label}</span>

                      {active && (
                        <span className="h-2 w-2 rounded-full bg-[#0B513D]" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="my-4 border-t border-gray-100" />

              {/* Logged-in mobile menu */}
              {user ? (
                <>
                  {/* User info */}
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] font-bold text-[#063B2B]">
                      {getInitials(user.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs font-semibold capitalize text-[#0B513D]">
                        {role?.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">

                    {/* Dashboard */}
                    <MobileMenuLink
                      href={getDashboardPath()}
                      icon={
                        <LayoutDashboard className="h-5 w-5" />
                      }
                      label="Dashboard"
                      onClick={closeMenus}
                    />

                    {/* Farmer-only links */}
                    {isFarmer && (
                      <>
                        {/* My Cart */}
                        <MobileMenuLink
                          href="/cart"
                          icon={
                            <ShoppingCart className="h-5 w-5" />
                          }
                          label="My Cart"
                          badge={
                            totalItems > 0
                              ? totalItems
                              : undefined
                          }
                          onClick={closeMenus}
                        />

                        {/* My Orders */}
                        <MobileMenuLink
                          href="/orders"
                          icon={
                            <Package className="h-5 w-5" />
                          }
                          label="My Orders"
                          onClick={closeMenus}
                        />

                        {/* Seller Orders */}
                        <MobileMenuLink
                          href="/seller-orders"
                          icon={
                            <Package className="h-5 w-5" />
                          }
                          label="Seller Orders"
                          onClick={closeMenus}
                        />
                      </>
                    )}

                    {/* Profile */}
                    <MobileMenuLink
                      href="/profile"
                      icon={
                        <User className="h-5 w-5" />
                      }
                      label="My Profile"
                      onClick={closeMenus}
                    />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                /* Logged-out mobile menu */
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="flex w-full items-center justify-center rounded-xl bg-[#063B2B] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register?role=expert"
                    onClick={closeMenus}
                    className="flex w-full items-center justify-center rounded-xl bg-[#D8E9DA] px-5 py-3 text-sm font-semibold text-[#315B45]"
                  >
                    Join as Expert
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}



function MobileMenuLink({
  href,
  icon,
  label,
  badge,
  active = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={
        active ? "page" : undefined
      }
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#EAF4ED] text-[#0B513D]"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={
            active
              ? "text-[#0B513D]"
              : "text-gray-500"
          }
        >
          {icon}
        </span>

        {label}
      </span>

      <span className="flex items-center gap-2">
        {active && (
          <span className="h-2 w-2 rounded-full bg-[#0B513D]" />
        )}

        {badge !== undefined && (
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
    </Link>
  );
}


function ProfileDropdown({
  user,
  role,
  isFarmer,
  totalItems,
  dashboardPath,
  onClose,
  onLogout,
}: {
  user: {
    name?: string | null;
    email?: string | null;
  };
  role?: string;
  isFarmer: boolean;
  totalItems: number;
  dashboardPath: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
      role="menu"
    >
      {/* User information */}
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] text-sm font-bold text-[#063B2B]">
            {getUserInitials(user.name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">
              {user.name}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        <span className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold capitalize text-green-700">
          {role?.toLowerCase()}
        </span>
      </div>

      {/* Dropdown links */}
      <div className="p-2">

        {/* Dashboard */}
        <DropdownLink
          href={dashboardPath}
          icon={
            <LayoutDashboard className="h-4 w-4" />
          }
          label="Dashboard"
          onClick={onClose}
        />

        {/* Farmer-only links */}
        {isFarmer && (
          <>
            {/* My Cart */}
            <DropdownLink
              href="/cart"
              icon={
                <ShoppingCart className="h-4 w-4" />
              }
              label="My Cart"
              badge={
                totalItems > 0
                  ? totalItems
                  : undefined
              }
              onClick={onClose}
            />

            {/* My Orders */}
            <DropdownLink
              href="/orders"
              icon={
                <Package className="h-4 w-4" />
              }
              label="My Orders"
              onClick={onClose}
            />

            {/* Seller Orders */}
            <DropdownLink
              href="/seller-orders"
              icon={
                <Package className="h-4 w-4" />
              }
              label="Seller Orders"
              onClick={onClose}
            />
          </>
        )}

        {/* Profile */}
        <DropdownLink
          href="/profile"
          icon={
            <User className="h-4 w-4" />
          }
          label="My Profile"
          onClick={onClose}
        />

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}



function DropdownLink({
  href,
  icon,
  label,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <span className="flex items-center gap-3">
        <span className="text-gray-500">
          {icon}
        </span>

        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}



function getUserInitials(
  name?: string | null
) {
  if (!name) {
    return "U";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}