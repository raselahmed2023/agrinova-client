import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function enforcePublicRoleBoundary() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return;
  }

  const role = String(
    session.user.role ?? ""
  ).toUpperCase();

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (role === "EXPERT") {
    redirect("/dashboard/expert");
  }
}