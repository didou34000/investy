import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 min
const LIMIT = 20;

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Basic Auth for Preview deployments (protect everything except allowed paths)
  const env = process.env.NEXT_PUBLIC_ENV;
  const isAllowedPath =
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/og") ||
    url.pathname.startsWith("/api/health");

  if (env === "preview" && !isAllowedPath) {
    const header = req.headers.get("authorization") || "";
    const expected =
      "Basic " + Buffer.from(`${process.env.PREVIEW_USER}:${process.env.PREVIEW_PASS}`).toString("base64");
    if (header !== expected) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Investy Preview"' },
      });
    }
  }
  const key = `${url.pathname}:${(req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "ip")}`;
  
  if (url.pathname.startsWith("/api/email") || url.pathname.startsWith("/api/quiz")) {
    const now = Date.now();
    const b = buckets.get(key) || { count: 0, ts: now };
    
    if (now - b.ts > WINDOW_MS) { 
      b.count = 0; 
      b.ts = now; 
    }
    
    b.count++; 
    buckets.set(key, b);
    
    if (b.count > LIMIT) {
      return new Response(JSON.stringify({ error: "rate_limited" }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/og|api/health).*)", "/api/:path*"]
};
