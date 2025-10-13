import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import {User} from "@/models/User";

// Secret key env 
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // find user 
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // password check
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // make JWT token 
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // create safe object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user.toObject(); // password remove ho gaya

    const res = NextResponse.json(
      { success: true, message: "Login successful", user: safeUser },
      { status: 200 }
    );

    // Token ko HttpOnly cookie me set karo
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    });


    return res;
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Login error:", err.message);
    else console.error("Login error:", err);
    return NextResponse.json(
      {  success: false, message: "Internal server error" },
      { status: 500}
    );
  }
}
