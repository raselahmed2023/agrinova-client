"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  signOut,
  useSession,
} from "@/lib/auth-client";

import {
  getMyCommunityProfile,
} from "@/services/community.service";

import {
  listStoredLocalImages,
} from "@/lib/image-storage";

import {
  Bot,
  BrainCircuit,
  CloudSun,
  HandCoins,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageSquareText,
  Package,
  PlusCircle,
  ShoppingBag,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";

interface FarmerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainItems = [
  {
    label: "Dashboard",
    href: "/dashboard/farmer",
    icon: LayoutDashboard,
  },
  {
    label: "My Farms",
    href: "/dashboard/farmer/farms",
    icon: Leaf,
  },
  {
    label: "Weather",
    href: "/dashboard/farmer/weather",
    icon: CloudSun,
  },
];

const aiItems = [
  {
    label: "Disease Detection",
    href: "/dashboard/farmer/ai/disease-detection",
    icon: BrainCircuit,
  },
  {
    label: "Smart Farming Recommendation",
    href: "/dashboard/farmer/ai/smart-farming-recommendation",
    icon: Leaf,
  },
  {
    label: "Farming Assistant",
    href: "/dashboard/farmer/ai/assistant",
    icon: Bot,
  },
];

const marketplaceItems = [
  {
    label: "Manage Products",
    href: "/marketplace/listings",
    icon: Package,
  },
  {
    label: "Sell Product",
    href: "/marketplace/sell",
    icon: PlusCircle,
  },
  {
    label: "Seller Orders",
    href: "/seller-orders",
    icon: ShoppingBag,
  },
];

const otherItems = [
  {
    label: "Finance",
    href: "/dashboard/farmer/finance",
    icon: WalletCards,
  },
  {
    label: "Expert Consultation",
    href: "/dashboard/farmer/consultation",
    icon: MessageSquareText,
  },
  {
    label: "Need Investment",
    href: "/dashboard/farmer/investment",
    icon: HandCoins,
  },
  {
    label: "My Investments",
    href: "/dashboard/farmer/my-investments",
    icon: TrendingUp,
  },
];

export default function FarmerSidebar({
  isOpen,
  onClose,
}: FarmerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = useSession();

  const user = session?.user;

  const [
    profileAvatar,
    setProfileAvatar,
  ] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setProfileAvatar("");
      return;
    }

    let active = true;

    const profilePurpose =
      `community-profile-${user.id}`;

    const getNewestLocalAvatar =
      () =>
        listStoredLocalImages(
          profilePurpose
        )
          .sort(
            (a, b) =>
              b.createdAt -
              a.createdAt
          )[0];

    const localAvatar =
      getNewestLocalAvatar();

    const typedUser =
      user as typeof user & {
        avatar?: string;
        image?: string;
      };

    const sessionAvatar =
      String(
        typedUser.avatar ||
          typedUser.image ||
          ""
      );

    if (
      localAvatar?.dataUrl
    ) {
      setProfileAvatar(
        localAvatar.dataUrl
      );
    } else {
      setProfileAvatar(
        sessionAvatar
      );
    }

    const loadProfileAvatar =
      async () => {
        try {
          const profile =
            await getMyCommunityProfile();

          const newestLocal =
            getNewestLocalAvatar();

          if (
            active &&
            !newestLocal?.dataUrl
          ) {
            setProfileAvatar(
              profile.avatar ||
                sessionAvatar
            );
          }
        } catch {
          // Keep local/session avatar
          // or initials if API fails.
        }
      };

    void loadProfileAvatar();

    const handleProfileUpdate =
      (
        event: Event
      ) => {
        const customEvent =
          event as CustomEvent<{
            avatar?: string;
          }>;

        if (
          typeof customEvent.detail
            ?.avatar === "string"
        ) {
          setProfileAvatar(
            customEvent.detail.avatar
          );
        }
      };

    window.addEventListener(
      "agrinova:profile-updated",
      handleProfileUpdate
    );

    return () => {
      active = false;

      window.removeEventListener(
        "agrinova:profile-updated",
        handleProfileUpdate
      );
    };
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();

    onClose();

    router.push("/");
    router.refresh();
  };

  const getInitials = (
    name?: string
  ) => {
    if (!name) return "U";

    return name
      .split(" ")
      .filter(Boolean)
      .map(
        (part) =>
          part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isActive = (
    href: string
  ) => {
    if (
      href ===
      "/dashboard/farmer"
    ) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  };

  const renderItem = (item: {
    label: string;
    href: string;
    icon: React.ElementType;
  }) => {
    const Icon = item.icon;
    const active =
      isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-[#EAF4ED] text-[#0B513D]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon
          className={`h-[18px] w-[18px] shrink-0 ${
            active
              ? "text-[#0B513D]"
              : "text-slate-400"
          }`}
        />

        <span>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:sticky lg:z-20 lg:translate-x-0 lg:shadow-none ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/AgriNova-Logo.png"
              alt="AgriNova"
              width={140}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />

            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Farmer
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {mainItems.map(
              renderItem
            )}
          </div>

          <SectionTitle>
            AI Tools
          </SectionTitle>

          <div className="space-y-1">
            {aiItems.map(
              renderItem
            )}
          </div>

          <SectionTitle>
            Marketplace
          </SectionTitle>

          <div className="space-y-1">
            {marketplaceItems.map(
              renderItem
            )}
          </div>

          <div className="mt-6 space-y-1">
            {otherItems.map(
              renderItem
            )}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="rounded-xl bg-slate-50 p-3">
            {isPending ? (
              <div className="animate-pulse">
                <div className="h-10 rounded bg-slate-200" />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D8E9DA] text-xs font-bold text-[#063B2B]">
                    {profileAvatar ? (
                      <img
                        src={
                          profileAvatar
                        }
                        alt={
                          user?.name ||
                          "Farmer profile"
                        }
                        className="h-full w-full object-cover"
                        onError={() =>
                          setProfileAvatar(
                            ""
                          )
                        }
                      />
                    ) : (
                      <span>
                        {getInitials(
                          user?.name
                        )}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {user?.name ||
                        "Farmer Account"}
                    </p>

                    <p
                      title={
                        user?.email ||
                        "Signed in account"
                      }
                      className="mt-0.5 truncate text-[11px] text-slate-500"
                    >
                      {user?.email ||
                        "Email unavailable"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  title="Logout"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      {children}
    </p>
  );
}