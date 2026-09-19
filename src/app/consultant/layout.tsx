import type {
  ReactNode,
} from "react";

import {
  enforcePublicRoleBoundary,
} from "@/lib/enforce-public-role-boundary";

export default async function ConsultantLayout({
  children,
}: {
  children: ReactNode;
}) {
  await enforcePublicRoleBoundary();

  return children;
}