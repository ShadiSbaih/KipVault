import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { Session } from "./lib/better-auth/auth-types";

async function getMiddlewareSession(req: NextRequest): Promise<Session | null> {
  // Skip internal HTTP verification if no session cookie is present.
  if (!getSessionCookie(req)) {
    return null;
  }

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as Session | null;
  } catch (error) {
    console.error("Middleware session check failed:", error);
    return null;
  }
}

export default async function authMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const url = req.url;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  if (pathname.startsWith("/dashboard")) {
    const session = await getMiddlewareSession(req);
    if (session) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/sign-in", url));
  }

  if (pathname.startsWith("/sign-")) {
    const session = await getMiddlewareSession(req);
    if (!session) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/dashboard", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on page routes only; skip Next.js internals, static files, and API routes
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
