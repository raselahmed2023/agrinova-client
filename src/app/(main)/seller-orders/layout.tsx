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
      "Seller Orders",

    description:
      "Manage marketplace orders for your products.",

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