"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Consultant", href: "/consultant" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    await signOut();

    setIsProfileOpen(false);

    router.push("/");
    router.refresh();
  };

  const getDashboardPath = () => {
    const role = user?.role?.toUpperCase();

    if (role === "ADMIN") {
      return "/dashboard/admin";
    }

    if (role === "EXPERT") {
      return "/dashboard/expert";
    }

    return "/dashboard/farmer";
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="text-lg font-bold text-[#063B2B]">
          AgriNova
        </Link>

        <div className="flex items-center gap-8">
          {/* Navigation */}
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

          {/* Session loading */}
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            /* Logged In */
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8E9DA] text-sm font-bold text-[#063B2B]">
                  {getInitials(user.name)}
                </div>

                {/* Name + role */}
                <div className="hidden text-left sm:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {user.role?.toLowerCase() || "farmer"}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  {/* User info */}
                  <div className="border-b border-gray-100 px-4 py-4">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        {user.role || "FARMER"}
                      </span>

                      {user.status && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {user.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    <Link
                      href={getDashboardPath()}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#063B2B]"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#063B2B]"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out */
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
          )}
        </div>
      </nav>
    </header>
  );
}