import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type UserRole = "FARMER" | "EXPERT" | "ADMIN";

/**
 * Get the correct dashboard for a user's role.
 */
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";

    case "EXPERT":
      return "/dashboard/expert";

    case "FARMER":
    default:
      return "/dashboard/farmer";
  }
}

/**
 * Return the role required to access a protected route.
 *
 * null means the route is not role-protected.
 */
function getRequiredRole(pathname: string): UserRole | null {
  // Admin dashboard
  if (
    pathname === "/dashboard/admin" ||
    pathname.startsWith("/dashboard/admin/")
  ) {
    return "ADMIN";
  }

  // Expert dashboard
  if (
    pathname === "/dashboard/expert" ||
    pathname.startsWith("/dashboard/expert/")
  ) {
    return "EXPERT";
  }

  // Farmer dashboard
  if (
    pathname === "/dashboard/farmer" ||
    pathname.startsWith("/dashboard/farmer/")
  ) {
    return "FARMER";
  }

  // Generic dashboard.
  // It is protected, but the user's role determines
  // which dashboard they should be sent to.
  if (pathname === "/dashboard") {
    return null;
  }

  // Checkout
  if (
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  ) {
    return "FARMER";
  }

  // Orders
  if (
    pathname === "/orders" ||
    pathname.startsWith("/orders/")
  ) {
    return "FARMER";
  }

  // Seller orders
  if (
    pathname === "/seller-orders" ||
    pathname.startsWith("/seller-orders/")
  ) {
    return "FARMER";
  }

  // Sell products
  if (
    pathname === "/marketplace/sell" ||
    pathname.startsWith("/marketplace/sell/")
  ) {
    return "FARMER";
  }

  // Seller listings
  if (
    pathname === "/marketplace/listings" ||
    pathname.startsWith("/marketplace/listings/")
  ) {
    return "FARMER";
  }

  // Public investment browsing is allowed, but submitting an investment
  // decision is a farmer-only action.
  if (/^\/investment\/[^/]+\/invest(?:\/|$)/.test(pathname)) {
    return "FARMER";
  }

  // Public route
  return null;
}

/**
 * Next.js 16 Proxy
 *
 * Protects private routes and redirects users
 * according to their authenticated role.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /*
   * /dashboard is special:
   * it requires authentication even though
   * getRequiredRole() returns null for it.
   */
  const isGenericDashboard = pathname === "/dashboard";

  const requiredRole = getRequiredRole(pathname);

  /*
   * Completely public route.
   *
   * If the route is not protected and is not
   * the generic dashboard, allow it immediately.
   */
  if (requiredRole === null && !isGenericDashboard) {
    return NextResponse.next();
  }

  try {
    /*
     * Use the headers from the actual incoming request.
     *
     * Do NOT use next/headers here.
     */
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    /*
     * User is not authenticated.
     */
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      const redirectPath = `${pathname}${search}`;

      loginUrl.searchParams.set("redirect", redirectPath);

      return NextResponse.redirect(loginUrl);
    }

    /*
     * Get the user's role safely.
     */
    const rawRole = String(
      session.user.role ?? ""
    ).toUpperCase();

    /*
     * Make sure the role is one of our supported roles.
     */
    if (
      rawRole !== "FARMER" &&
      rawRole !== "EXPERT" &&
      rawRole !== "ADMIN"
    ) {
      console.error(
        "Invalid user role:",
        session.user.role
      );

      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    const role = rawRole as UserRole;

    /*
     * /dashboard
     *
     * Send the user to the dashboard
     * that matches their role.
     */
    if (isGenericDashboard) {
      return NextResponse.redirect(
        new URL(
          getDashboardPath(role),
          request.url
        )
      );
    }

    /*
     * Role-protected route.
     *
     * Example:
     * FARMER trying to access /dashboard/admin
     * will be redirected to /dashboard/farmer.
     */
    if (
      requiredRole !== null &&
      role !== requiredRole
    ) {
      return NextResponse.redirect(
        new URL(
          getDashboardPath(role),
          request.url
        )
      );
    }

    /*
     * Authentication and role are valid.
     */
    return NextResponse.next();
  } catch (error) {
    console.error(
      "Route protection error:",
      error
    );

    /*
     * If authentication itself fails,
     * send the user to login.
     */
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${search}`
    );

    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Routes handled by the Proxy.
 *
 * Public marketplace browsing remains accessible.
 * Only private marketplace actions are protected.
 */
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",

    "/checkout",
    "/checkout/:path*",

    "/orders",
    "/orders/:path*",

    "/seller-orders",
    "/seller-orders/:path*",

    "/marketplace/sell",
    "/marketplace/sell/:path*",

    "/marketplace/listings",
    "/marketplace/listings/:path*",

    // Run Proxy for Investment routes; getRequiredRole keeps catalog/detail
    // public and protects only /investment/:projectId/invest.
    "/investment/:path*",
  ],
};