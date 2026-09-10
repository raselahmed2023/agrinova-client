"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const navLinks = [
  {
    label: "Marketplace",
    href: "/marketplace",
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
    label: "Support",
    href: "/support",
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } =
    useSession();

  const { totalItems } = useCart();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const user = session?.user;

  const role =
    user?.role?.toUpperCase();

  const isFarmer =
    role === "FARMER";

  const isExpert =
    role === "EXPERT";

  const isAdmin =
    role === "ADMIN";

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

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

  const getDashboardPath = () => {
    if (isAdmin) {
      return "/dashboard/admin";
    }

    if (isExpert) {
      return "/dashboard/expert";
    }

    return "/dashboard/farmer";
  };

  const getInitials = (
    name?: string | null
  ) => {
    if (!name) {
      return "U";
    }

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };

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
          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B513D] text-white">
              <span className="text-sm font-bold">
                A
              </span>
            </div>

            <span className="text-lg font-bold text-[#063B2B]">
              AgriNova
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(
                  `${link.href}/`
                );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-[#063B2B]"
                      : "text-gray-700 hover:text-[#063B2B]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center gap-3 lg:flex">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (current) =>
                        !current
                    )
                  }
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8E9DA] text-sm font-bold text-[#063B2B]">
                    {getInitials(
                      user.name
                    )}
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
                    className={`h-4 w-4 text-gray-500 transition ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <ProfileDropdown
                    user={user}
                    role={role}
                    isFarmer={isFarmer}
                    totalItems={
                      totalItems
                    }
                    dashboardPath={getDashboardPath()}
                    onClose={() =>
                      setProfileOpen(
                        false
                      )
                    }
                    onLogout={
                      handleLogout
                    }
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

          {/* MOBILE RIGHT */}
          <div className="flex items-center gap-2 lg:hidden">
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
                      {totalItems >
                      99
                        ? "99+"
                        : totalItems}
                    </span>
                  )}
              </Link>
            )}

            {!user &&
              !isPending && (
                <Link
                  href="/login"
                  className="rounded-lg bg-[#063B2B] px-4 py-2 text-sm font-semibold text-white"
                >
                  Login
                </Link>
              )}

            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                mobileOpen
              }
              onClick={() =>
                setMobileOpen(
                  (current) =>
                    !current
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

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() =>
              setMobileOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />

          <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-200 bg-white shadow-xl lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
              {/* MAIN LINKS */}
              <div className="space-y-1">
                {navLinks.map(
                  (link) => {
                    const active =
                      pathname ===
                        link.href ||
                      pathname.startsWith(
                        `${link.href}/`
                      );

                    return (
                      <Link
                        key={
                          link.href
                        }
                        href={
                          link.href
                        }
                        onClick={
                          closeMenus
                        }
                        className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold ${
                          active
                            ? "bg-[#EAF4ED] text-[#0B513D]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {
                          link.label
                        }
                      </Link>
                    );
                  }
                )}
              </div>

              <div className="my-4 border-t border-gray-100" />

              {/* LOGGED IN MOBILE */}
              {user ? (
                <>
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] font-bold text-[#063B2B]">
                      {getInitials(
                        user.name
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {
                          user.name
                        }
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {
                          user.email
                        }
                      </p>

                      <p className="mt-1 text-xs font-semibold capitalize text-[#0B513D]">
                        {role?.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <MobileMenuLink
                      href={getDashboardPath()}
                      icon={
                        <LayoutDashboard className="h-5 w-5" />
                      }
                      label="Dashboard"
                      onClick={
                        closeMenus
                      }
                    />

                    {isFarmer && (
                      <>
                        <MobileMenuLink
                          href="/marketplace"
                          icon={
                            <Store className="h-5 w-5" />
                          }
                          label="Marketplace"
                          onClick={
                            closeMenus
                          }
                        />

                        <MobileMenuLink
                          href="/cart"
                          icon={
                            <ShoppingCart className="h-5 w-5" />
                          }
                          label="My Cart"
                          badge={
                            totalItems >
                            0
                              ? totalItems
                              : undefined
                          }
                          onClick={
                            closeMenus
                          }
                        />

                        <MobileMenuLink
                          href="/orders"
                          icon={
                            <Package className="h-5 w-5" />
                          }
                          label="My Orders"
                          onClick={
                            closeMenus
                          }
                        />

                        <MobileMenuLink
                          href="/marketplace?tab=manage"
                          icon={
                            <Store className="h-5 w-5" />
                          }
                          label="Manage Products"
                          onClick={
                            closeMenus
                          }
                        />

                        <MobileMenuLink
                          href="/marketplace/sell"
                          icon={
                            <Store className="h-5 w-5" />
                          }
                          label="Sell Product"
                          onClick={
                            closeMenus
                          }
                        />

                        <MobileMenuLink
                          href="/seller-orders"
                          icon={
                            <Package className="h-5 w-5" />
                          }
                          label="Seller Orders"
                          onClick={
                            closeMenus
                          }
                        />
                      </>
                    )}

                    <MobileMenuLink
                      href="/profile"
                      icon={
                        <User className="h-5 w-5" />
                      }
                      label="My Profile"
                      onClick={
                        closeMenus
                      }
                    />

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                /* LOGGED OUT MOBILE */
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={
                      closeMenus
                    }
                    className="flex w-full items-center justify-center rounded-xl bg-[#063B2B] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register?role=expert"
                    onClick={
                      closeMenus
                    }
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
      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
    >
      <span className="flex items-center gap-3">
        <span className="text-gray-500">
          {icon}
        </span>

        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
          {badge > 99
            ? "99+"
            : badge}
        </span>
      )}
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
    <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] text-sm font-bold text-[#063B2B]">
            {user.name
              ? user.name
                  .split(" ")
                  .map(
                    (part) =>
                      part[0]
                  )
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U"}
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

      <div className="p-2">
        <DropdownLink
          href={dashboardPath}
          icon={
            <LayoutDashboard className="h-4 w-4" />
          }
          label="Dashboard"
          onClick={onClose}
        />

        {isFarmer && (
          <>
            <DropdownLink
              href="/marketplace"
              icon={
                <Store className="h-4 w-4" />
              }
              label="Marketplace"
              onClick={onClose}
            />

            <DropdownLink
              href="/cart"
              icon={
                <ShoppingCart className="h-4 w-4" />
              }
              label="My Cart"
              badge={
                totalItems >
                0
                  ? totalItems
                  : undefined
              }
              onClick={onClose}
            />

            <DropdownLink
              href="/orders"
              icon={
                <Package className="h-4 w-4" />
              }
              label="My Orders"
              onClick={onClose}
            />

            <DropdownLink
              href="/marketplace?tab=manage"
              icon={
                <Store className="h-4 w-4" />
              }
              label="Manage Products"
              onClick={onClose}
            />

            <DropdownLink
              href="/marketplace/sell"
              icon={
                <Store className="h-4 w-4" />
              }
              label="Sell Product"
              onClick={onClose}
            />

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

        <DropdownLink
          href="/profile"
          icon={
            <User className="h-4 w-4" />
          }
          label="My Profile"
          onClick={onClose}
        />

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
          {badge > 99
            ? "99+"
            : badge}
        </span>
      )}
    </Link>
  );
}