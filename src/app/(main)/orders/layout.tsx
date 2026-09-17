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
      "My Orders",

    description:
      "Review your AgriNova marketplace orders.",

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