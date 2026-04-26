import { NextResponse } from "next/server";

const DEAD_PATTERNS = [
  /^\/wp-admin(\/|$)/,
  /^\/wp-login\.php/,
  /^\/wp-includes(\/|$)/,
  /^\/wp-content(\/|$)/,
  /^\/wp-json(\/|$)/,
  /^\/xmlrpc\.php/,
  /^\/feed(\/|$)/,
  /^\/comments\/feed(\/|$)/,
  /^\/\?feed=/,
  /^\/\.env/,
  /^\/\.git(\/|$)/,
  /^\/sitemap[._-].*\.(xml|gz)$/,
];

export function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const fullPath = pathname + (search || "");

  for (const pattern of DEAD_PATTERNS) {
    if (pattern.test(fullPath)) {
      return new NextResponse(null, { status: 410 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/|api/|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
};
