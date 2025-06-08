import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/auth";

const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["/admin"];

// Exact public routes
const publicRoutes = [
  "/",
  "/services",
  "/reviews",
  "/contact",
  "/about",
  "/pricing",
  "/terms",
  "/privacy",
];

// Public route patterns (regex)
const publicRoutePatterns = [
  /^\/blog(\/.*)?$/, // /blog and /blog/*
  /^\/services\/[^\/]+$/, // /services/cleaning, /services/maintenance, etc.
  /^\/reviews\/[^\/]+$/, // /reviews/123, /reviews/abc, etc.
];

function isPublicRoute(pathname: string): boolean {
  // Check exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check pattern matches
  return publicRoutePatterns.some((pattern) => pattern.test(pathname));
}

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);
  const isPublicRouteMatch = isPublicRoute(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // If no session exists
  if (!session) {
    // Allow access to public routes, auth routes, and password routes
    if (isPublicRouteMatch || isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    // Redirect to home page for protected routes
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is logged in and tries to access auth/password routes, redirect to home
  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check admin access
  if (isAdminRoute && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
