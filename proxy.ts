import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type UserRole = "FARMER" | "EXPERT" | "ADMIN";


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



function getRequiredRole(pathname: string, searchParams: URLSearchParams): UserRole | null {
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

 
  if (pathname === "/dashboard") {
    return null;
  }


  if (
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  ) {
    return "FARMER";
  }

 
  if (
    pathname === "/orders" ||
    pathname.startsWith("/orders/")
  ) {
    return "FARMER";
  }

 
  if (
    pathname === "/seller-orders" ||
    pathname.startsWith("/seller-orders/")
  ) {
    return "FARMER";
  }

  
  if (
    pathname === "/marketplace/sell" ||
    pathname.startsWith("/marketplace/sell/")
  ) {
    return "FARMER";
  }

  
  if (
    pathname === "/marketplace/listings" ||
    pathname.startsWith("/marketplace/listings/")
  ) {
    return "FARMER";
  }


  
  if (
    /^\/marketplace\/[^/]+$/.test(pathname) &&
    searchParams.get("edit") === "1"
  ) {
    return "FARMER";
  }

 
  if (/^\/investment\/[^/]+\/invest(?:\/|$)/.test(pathname)) {
    return "FARMER";
  }


  if (
    pathname === "/community/profile" ||
    pathname.startsWith("/community/profile/")
  ) {
    return "FARMER";
  }

  return null;
}


export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

 
  const isGenericDashboard = pathname === "/dashboard";

  const requiredRole = getRequiredRole(pathname, request.nextUrl.searchParams);

  
  if (requiredRole === null && !isGenericDashboard) {
    return NextResponse.next();
  }

  try {
   
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      const redirectPath = `${pathname}${search}`;

      loginUrl.searchParams.set("redirect", redirectPath);

      return NextResponse.redirect(loginUrl);
    }

    
    const rawRole = String(
      session.user.role ?? ""
    ).toUpperCase();

    
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

    
    if (isGenericDashboard) {
      return NextResponse.redirect(
        new URL(
          getDashboardPath(role),
          request.url
        )
      );
    }

    
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

    
    "/marketplace/:path*",

   
    "/investment/:path*",

   
    "/community/:path*",
  ],
};