"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Image from "next/image";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  signOut,
  useSession,
} from "@/lib/auth-client";

import {
  useCart,
} from "@/context/CartContext";

import NotificationBell from "@/components/shared/NotificationBell";

import {
  getMyCommunityProfile,
} from "@/services/community.service";

const navLinks = [
  {
    label:
      "Community",

    href:
      "/community",
  },

  {
    label:
      "Marketplace",

    href:
      "/marketplace",
  },

  {
    label:
      "Investment",

    href:
      "/investment",
  },

  {
    label:
      "Experts",

    href:
      "/consultant",
  },

  {
    label:
      "Blog",

    href:
      "/blog",
  },

  {
    label:
      "B2B Support",

    href:
      "/support",
  },
];

function getInitials(
  name?: string | null
) {
  if (!name) {
    return "U";
  }

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  return parts
    .map(
      (
        part
      ) =>
        part[0]
    )
    .join("")
    .slice(
      0,
      2
    )
    .toUpperCase();
}

function UserAvatar({
  name,
  avatar,
  size =
    "h-10 w-10",
}: {
  name?: string | null;

  avatar?:
    string;

  size?:
    string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dcebdd] text-sm font-black text-[#064e3b] ${size}`}
    >
      {avatar ? (
        <img
          src={
            avatar
          }
          alt={
            name ||
            "Profile"
          }
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(
          name
        )
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    data:
      session,

    isPending,
  } =
    useSession();

  const {
    totalItems,
  } =
    useCart();

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(
      false
    );

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(
      false
    );

  const [
    profileAvatar,
    setProfileAvatar,
  ] =
    useState("");

  const user =
    session?.user;

  const role =
    String(
      user?.role ||
        ""
    ).toUpperCase();

  const isFarmer =
    role ===
    "FARMER";

  const isExpert =
    role ===
    "EXPERT";

  const isAdmin =
    role ===
    "ADMIN";

  const dashboardPath =
    isAdmin
      ? "/dashboard/admin"
      : isExpert
        ? "/dashboard/expert"
        : "/dashboard/farmer";

  useEffect(() => {
    setMobileOpen(
      false
    );

    setProfileOpen(
      false
    );
  }, [
    pathname,
  ]);

  useEffect(() => {
    if (
      !isFarmer ||
      !user
    ) {
      return;
    }

    let active =
      true;

    const load =
      async () => {
        try {
          const profile =
            await getMyCommunityProfile();

          if (
            active
          ) {
            setProfileAvatar(
              profile.avatar ||
                ""
            );
          }
        } catch {
          // Keep initials.
        }
      };

    void load();

    const updateHandler =
      (
        event:
          Event
      ) => {
        const customEvent =
          event as CustomEvent<{
            avatar?: string;
          }>;

        if (
          customEvent.detail
            ?.avatar
        ) {
          setProfileAvatar(
            customEvent.detail
              .avatar
          );
        }
      };

    window.addEventListener(
      "agrinova:profile-updated",

      updateHandler
    );

    return () => {
      active =
        false;

      window.removeEventListener(
        "agrinova:profile-updated",

        updateHandler
      );
    };
  }, [
    isFarmer,
    user,
  ]);

  const active = (
    href:
      string
  ) =>
    pathname ===
      href ||
    pathname.startsWith(
      `${href}/`
    );

  const logout =
    async () => {
      await signOut();

      router.push(
        "/"
      );

      router.refresh();
    };

  return (
    <>
      <header className="sticky top-0 z-[70] border-b border-slate-200/80 bg-white/95 shadow-[0_1px_10px_rgba(15,23,42,.03)] backdrop-blur-xl">

        <nav className="mx-auto grid h-[68px] max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-5 px-4 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={
                140
              }
              height={
                45
              }
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center justify-center lg:flex">
            <div className="flex items-center gap-6">

              {navLinks.map(
                (
                  link
                ) => {
                  const selected =
                    active(
                      link.href
                    );

                  return (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className={`relative py-[24px] text-[14px] font-semibold ${
                        selected
                          ? "text-emerald-800"
                          : "text-slate-600 hover:text-emerald-800"
                      }`}
                    >
                      {
                        link.label
                      }

                      {selected && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-emerald-700" />
                      )}
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          <div className="hidden items-center justify-end gap-2 lg:flex">

            {!isPending &&
              user && (
                <>
                  <NotificationBell />

                  {isFarmer && (
                    <Link
                      href="/cart"
                      className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                    >
                      <ShoppingCart className="h-5 w-5" />

                      {totalItems >
                        0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-700 px-1 text-[9px] font-black text-white">
                          {
                            totalItems
                          }
                        </span>
                      )}
                    </Link>
                  )}

                  <div className="relative ml-1">

                    <button
                      type="button"
                      onClick={() =>
                        setProfileOpen(
                          (
                            value
                          ) =>
                            !value
                        )
                      }
                      className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 hover:bg-slate-50"
                    >
                      <UserAvatar
                        name={
                          user.name
                        }
                        avatar={
                          profileAvatar
                        }
                      />

                      <div className="hidden text-left xl:block">
                        <p className="max-w-[130px] truncate text-sm font-bold text-slate-900">
                          {
                            user.name
                          }
                        </p>

                        <p className="text-[11px] capitalize text-slate-500">
                          {role.toLowerCase()}
                        </p>
                      </div>

                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-[52px] w-[290px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                        <div className="flex items-center gap-3 border-b border-slate-100 p-4">

                          <UserAvatar
                            name={
                              user.name
                            }
                            avatar={
                              profileAvatar
                            }
                            size="h-12 w-12"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {
                                user.name
                              }
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {
                                user.email
                              }
                            </p>
                          </div>
                        </div>

                        <div className="p-2">

                          <DropdownLink
                            href={
                              dashboardPath
                            }
                            icon={
                              <LayoutDashboard className="h-4 w-4" />
                            }
                            label="Dashboard"
                          />

                          {isFarmer && (
                            <>
                              <DropdownLink
                                href={`/community/profile/${user.id}`}
                                icon={
                                  <UserAvatar
                                    name={
                                      user.name
                                    }
                                    avatar={
                                      profileAvatar
                                    }
                                    size="h-5 w-5 text-[7px]"
                                  />
                                }
                                label="Community Profile"
                              />

                              <DropdownLink
                                href="/orders"
                                icon={
                                  <Package className="h-4 w-4" />
                                }
                                label="My Orders"
                              />
                            </>
                          )}

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() =>
                              void logout()
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />

                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

            {!isPending &&
              !user && (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Join AgriNova
                  </Link>
                </>
              )}
          </div>

          <div className="flex justify-end lg:hidden">

            {user && (
              <NotificationBell />
            )}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-[68px] z-[65] border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden">

          <div className="space-y-1">

            {navLinks.map(
              (
                link
              ) => (
                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  {
                    link.label
                  }
                </Link>
              )
            )}

            {user && (
              <>
                <Link
                  href={
                    dashboardPath
                  }
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    void logout()
                  }
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DropdownLink({
  href,
  icon,
  label,
}: {
  href:
    string;

  icon:
    ReactNode;

  label:
    string;
}) {
  return (
    <Link
      href={
        href
      }
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <span className="text-slate-400">
        {
          icon
        }
      </span>

      {
        label
      }
    </Link>
  );
}