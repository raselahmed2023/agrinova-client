import FarmerDashboardShell from "@/components/dashboard/FarmerDashboardShell";

import {
  requireRole,
} from "@/lib/require-role";
export const dynamic =
  "force-dynamic";

export default async function FarmerDashboardLayout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  await requireRole(
    "FARMER"
  );

  return (
    <FarmerDashboardShell>
      {children}
    </FarmerDashboardShell>
  );
}