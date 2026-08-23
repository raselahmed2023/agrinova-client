import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "FARMER") {
    redirect("/dashboard/farmer");
  }

  if (role === "EXPERT") {
    redirect("/dashboard/expert");
  }

  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  redirect("/");
}