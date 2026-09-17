import type {
  Metadata,
} from "next";

import {
  requireRole,
} from "@/lib/require-role";

export const dynamic =
  "force-dynamic";

export const metadata:
  Metadata = {
    title:
      "My Marketplace Listings",

    description:
      "Manage your marketplace listings.",

    robots: {
      index: false,
      follow: false,
    },
  };

export default async function Layout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  await requireRole(
    "FARMER"
  );

  return children;
}