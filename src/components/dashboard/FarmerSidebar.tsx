"use client";

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
  Bot,
  BrainCircuit,
  CloudSun,
  HandCoins,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageSquareText,
  ShoppingBag,
  Store,
  Tags,
  WalletCards,
  X,
} from "lucide-react";

interface FarmerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
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
    label: "Browse",
    href: "/dashboard/farmer/marketplace",
    icon: ShoppingBag,
  },
  {
    label: "Sell Product",
    href: "/dashboard/farmer/marketplace/sell",
    icon: Store,
  },
  {
    label: "My Listings",
    href: "/dashboard/farmer/marketplace/listings",
    icon: Tags,
  },
  {
    label: "Purchase Requests",
    href: "/dashboard/farmer/marketplace/requests",
    icon: MessageSquareText,
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
];

export default function FarmerSidebar({
  isOpen,
  onClose,
}: FarmerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: session,
    isPending,
  } = useSession();

  const user = session?.user;

  const handleLogout = async () => {
    await signOut();

    onClose();

    router.push("/");
    router.refresh();
  };

  const getInitials = (
    name?: string
  ) => {
    if (!name) {
      return "U";
    }

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isActive = (
    href: string
  ) => {
    if (
      href === "/dashboard/farmer" ||
      href ===
        "/dashboard/farmer/marketplace"
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 lg:shadow-none ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 transition hover:opacity-90"
            title="AgriNova Home"
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
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map(
              renderItem
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              AI Tools
            </p>

            <div className="space-y-1">
              {aiItems.map(
                renderItem
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Marketplace
            </p>

            <div className="space-y-1">
              {marketplaceItems.map(
                renderItem
              )}
            </div>
          </div>

          <div className="mt-6 space-y-1">
            {otherItems.map(
              renderItem
            )}
          </div>
        </nav>

        <div className="border-t border-slate-200 bg-white p-3">
          <div className="mb-3 rounded-xl bg-[#F5F8F6] p-3">
            <p className="text-xs font-semibold text-[#0B513D]">
              Grow Smarter
            </p>

            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              Use AgriNova tools to
              manage your farm and
              make better decisions.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            {isPending ? (
              <div className="flex animate-pulse items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="h-3.5 w-20 rounded bg-slate-200" />

                  <div className="h-2.5 w-28 rounded bg-slate-200" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8E9DA] text-xs font-bold text-[#063B2B]">
                    {getInitials(
                      user?.name
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold leading-tight text-slate-900">
                      {user?.name ||
                        "Farmer Account"}
                    </p>

                    <p
                      className="mt-0.5 truncate text-[11px] leading-tight text-slate-500"
                      title={
                        user?.email ||
                        "Signed In"
                      }
                    >
                      {user?.email ||
                        "farmer@agrinova.io"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  title="Logout from AgriNova"
                  aria-label="Logout"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 active:scale-95"
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