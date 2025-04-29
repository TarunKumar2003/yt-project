import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/signin", "/signup", "/home"]);
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);
export default clerkMiddleware((auth, req) => {
  const { userId }: any = auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashnoard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");
  // If user logged in
  if (userId && isPublicRoute(req) && !isAccessingDashnoard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // User Not logged in
  if (!userId) {
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
