//src/app/api/auth/school/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { School } from "@/models/School";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// OPTIONS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

// POST login
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);
  console.log("done hai ji")
  try {
    await connectDB();
    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Email and password required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        { status: 401, headers: corsHeaders }
      );
    }

    if (!user.password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User has no password set" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid credentials" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: remember ? "30d" : "7d" }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user.toObject();

    const school = user.schoolId ? await School.findById(user.schoolId) : null;

    const response = NextResponse.json(
      { success: true, message: "Login successful", user: safeUser, school },
      { status: 200, headers: corsHeaders }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    });

    return response;

  } catch (err) {
    console.error("❌ Login error:", err);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
