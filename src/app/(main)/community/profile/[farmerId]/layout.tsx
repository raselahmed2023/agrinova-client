import {
  requireRole,
} from "@/lib/require-role";

export const dynamic =
  "force-dynamic";

export default async function CommunityProfileLayout({
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