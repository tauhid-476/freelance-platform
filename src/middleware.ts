import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path === "/" || path === "/auth/signin" || path === "/auth/signup") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Routes that require user to be authenticated
    if (path.startsWith("/gigs")) {
      // Creating a gig requires authentication
      if (req.method === "POST") {
        return NextResponse.next();
      }

      // Specific gig operations
      if (path.match(/^\/gigs\/[\w-]+$/)) {
        // Allow reading gigs without restrictions
        if (req.method === "GET") {
          return NextResponse.next();
        }
        
        // For update and delete, check if user owns the gig
        if (req.method === "PUT" || req.method === "DELETE") {
          // You might want to add additional checks here to verify gig ownership
          return NextResponse.next();
        }
      }

      // Applications related routes
      if (path.includes("/applications")) {
        // Only authenticated users can apply
        if (req.method === "POST") {
          return NextResponse.next();
        }
        
        // For viewing applications, ensure user is either the gig owner or the applicant
        if (req.method === "GET") {
          return NextResponse.next();
        }
      }

      // Hiring route - ensure user is the gig owner
      if (path.includes("/hire") && req.method === "POST") {
        return NextResponse.next();
      }
    }

    // User-specific routes
    if (path.includes(`/gigs/${token.sub}`) || path.includes(`/applications/${token.sub}`)) {
      // Ensure users can only access their own data
      if (req.method === "GET") {
        return NextResponse.next();
      }
    }

    // Default response for unmatched conditions
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Specify which routes should be protected by the middleware
export const config = {
  matcher: [
    "/gigs/:path*",
    "/applications/:path*",
    "/api/gigs/:path*",
    "/api/applications/:path*",
  ]
};