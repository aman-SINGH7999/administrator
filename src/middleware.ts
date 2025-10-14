// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(JWT_SECRET);

// ✅ Public routes list
const publicPaths = ["/api/auth/login", "/api/auth/forgot-password", '/api/auth/school/login'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Agar route public hai → token check skip karo
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (req.method === "OPTIONS") return NextResponse.next();

  const rawToken = req.cookies.get("token")?.value;
  if (!rawToken) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Clean token (sometimes quotes wrap)
  const token = rawToken.trim().replace(/^"|"$/g, "");

  try {

     const { payload } = await jwtVerify(token, secretKey);
    
     // 👉 Optionally, pass user info to downstream handlers
     console.log("payload: ", payload);
    const res = NextResponse.next();
    if (payload?.userId) res.headers.set("x-user-id", String(payload.userId));
    if (payload?.role) res.headers.set("x-user-role", String(payload.role));

    return res;

  } catch (err) {
    console.error("JWT verify error:", err);
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"], // sabhi API routes
};
