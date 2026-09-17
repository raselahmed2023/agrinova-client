import type {
  ReactNode,
} from "react";
export const dynamic =
  "force-dynamic";

import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

import {
  requireRole,
} from "@/lib/require-role";

export default async function AdminLayout({
  children,
}: {
  children:
    ReactNode;
}) {
  await requireRole(
    "ADMIN"
  );

  return (
    <AdminDashboardShell>
      {children}
    </AdminDashboardShell>
  );
}