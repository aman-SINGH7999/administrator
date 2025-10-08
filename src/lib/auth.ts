// src/lib/auth.ts
import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AuthUser {
  userId: string;
  role: string;
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | NextResponse> {
  try {
    const rawToken = req.cookies.get("token")?.value;
    if (!rawToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = rawToken.trim().replace(/^"|"$/g, "");
    const { payload } = await jwtVerify(token, secretKey);

    const userId = payload.userId as string;
    const role = payload.role as string;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 401 });
    }

    // ✅ return plain data for easy use inside routes
    return { userId, role };
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
