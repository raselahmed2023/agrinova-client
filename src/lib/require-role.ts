import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AppRole =
  | "FARMER"
  | "EXPERT"
  | "ADMIN";

function dashboardForRole(
  role: string
) {
  switch (
    role.toUpperCase()
  ) {
    case "ADMIN":
      return "/dashboard/admin";

    case "EXPERT":
      return "/dashboard/expert";

    case "FARMER":
      return "/dashboard/farmer";

    default:
      return "/login";
  }
}

export async function requireAuth() {
  const requestHeaders =
    await headers();

  const session =
    await auth.api.getSession({
      headers:
        requestHeaders,
    });

  if (
    !session?.user
  ) {
    redirect(
      "/login"
    );
  }

  const status =
    String(
      session.user.status ??
        "APPROVED"
    ).toUpperCase();

  const active =
    status === "APPROVED" ||
    status === "ACTIVE";

  if (
    !active
  ) {
    redirect(
      `/login?accountStatus=${encodeURIComponent(
        status
      )}`
    );
  }

  return session;
}


export async function requireRole(
  requiredRole:
    AppRole
) {
  const session =
    await requireAuth();

  const role =
    String(
      session.user.role ??
        ""
    ).toUpperCase();

  if (
    role !==
    requiredRole
  ) {
    redirect(
      dashboardForRole(
        role
      )
    );
  }

  return session;
}