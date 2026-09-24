import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type UserRole = "FARMER" | "EXPERT" | "ADMIN";

type AccountStatus =
  | "APPROVED"
  | "ACTIVE"
  | "PENDING"
  | "REJECTED"
  | "BLOCKED";

function getDashboardPath(role: UserRole) {
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


function isAdminRoute(pathname: string) {
  return (
    pathname === "/dashboard/admin" ||
    pathname.startsWith("/dashboard/admin/")
  );
}

function isExpertRoute(pathname: string) {
  return (
    pathname === "/dashboard/expert" ||
    pathname.startsWith("/dashboard/expert/")
  );
}

function isFarmerDashboardRoute(pathname: string) {
  return (
    pathname === "/dashboard/farmer" ||
    pathname.startsWith("/dashboard/farmer/")
  );
}

function isFarmerOnlyRoute(
  pathname: string,
  searchParams: URLSearchParams
) {

  if (isFarmerDashboardRoute(pathname)) {
    return true;
  }

  if (
    pathname === "/marketplace/sell" ||
    pathname.startsWith("/marketplace/sell/")
  ) {
    return true;
  }


  if (
    pathname === "/marketplace/listings" ||
    pathname.startsWith("/marketplace/listings/")
  ) {
    return true;
  }


  if (
    /^\/marketplace\/[^/]+$/.test(pathname) &&
    searchParams.get("edit") === "1"
  ) {
    return true;
  }


  if (
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  ) {
    return true;
  }


  if (
    pathname === "/orders" ||
    pathname.startsWith("/orders/")
  ) {
    return true;
  }


  if (
    pathname === "/seller-orders" ||
    pathname.startsWith("/seller-orders/")
  ) {
    return true;
  }


  if (
    /^\/investment\/[^/]+\/invest(?:\/|$)/.test(pathname)
  ) {
    return true;
  }

  if (
    pathname.startsWith("/community/profile/")
  ) {
    return true;
  }

  return false;
}

function isProtectedRoute(
  pathname: string,
  searchParams: URLSearchParams
) {
  if (pathname === "/dashboard") {
    return true;
  }

  if (isAdminRoute(pathname)) {
    return true;
  }

  if (isExpertRoute(pathname)) {
    return true;
  }

  if (
    isFarmerOnlyRoute(
      pathname,
      searchParams
    )
  ) {
    return true;
  }

  return false;
}

function isAccountRecoveryRoute(
  pathname: string
) {
  return (
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  );
}

function isAuthRoute(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/register/expert"
  );
}


export async function proxy(
  request: NextRequest
) {
  const {
    pathname,
    search,
    searchParams,
  } = request.nextUrl;

  const protectedRoute =
    isProtectedRoute(
      pathname,
      searchParams
    );

  try {
    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!session?.user) {
      /**
       * Public pages are allowed.
       */
      if (!protectedRoute) {
        return NextResponse.next();
      }

  
      const loginUrl = new URL(
        "/login",
        request.url
      );

  
      loginUrl.searchParams.set(
        "redirect",
        `${pathname}${search}`
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    const rawRole = String(
      session.user.role ?? ""
    ).toUpperCase();
    if (
      rawRole !== "FARMER" &&
      rawRole !== "EXPERT" &&
      rawRole !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );
    }

    const role =
      rawRole as UserRole;

    const accountStatus = String(
      session.user.status ??
        "APPROVED"
    ).toUpperCase() as AccountStatus;

    const accountIsActive =
      accountStatus === "APPROVED" ||
      accountStatus === "ACTIVE";


    if (!accountIsActive) {

      if (
        isAccountRecoveryRoute(
          pathname
        )
      ) {
        return NextResponse.next();
      }

      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "accountStatus",
        accountStatus
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    if (role === "ADMIN") {
      /**
       * Already inside admin portal.
       */
      if (isAdminRoute(pathname)) {
        return NextResponse.next();
      }

 
      return NextResponse.redirect(
        new URL(
          getDashboardPath(role),
          request.url
        )
      );
    }

 
    if (role === "EXPERT") {
      /**
       * Already inside expert portal.
       */
      if (isExpertRoute(pathname)) {
        return NextResponse.next();
      }

     
      return NextResponse.redirect(
        new URL(
          getDashboardPath(role),
          request.url
        )
      );
    }

   
    if (pathname === "/dashboard") {
      return NextResponse.redirect(
        new URL(
          "/dashboard/farmer",
          request.url
        )
      );
    }

 
    if (isAdminRoute(pathname)) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/farmer",
          request.url
        )
      );
    }

    
    if (isExpertRoute(pathname)) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/farmer",
          request.url
        )
      );
    }

    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(
        new URL(
          "/dashboard/farmer",
          request.url
        )
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error(
      "AgriNova route protection failed:",
      error
    );

    
    if (!protectedRoute) {
      return NextResponse.next();
    }

   
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      `${pathname}${search}`
    );

    return NextResponse.redirect(
      loginUrl
    );
  }
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};