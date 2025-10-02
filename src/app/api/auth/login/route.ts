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

    const { email, password } = await req.json();

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
    const isMatch = await bcrypt.compare(password, user.password);
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
    const { password: _, ...safeUser } = user.toObject(); // password remove ho gaya

    const res = NextResponse.json(
      { success: true, message: "Login successful", user: safeUser },
      { status: 200 }
    );

    // Token ko HttpOnly cookie me set karo
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false, 
      // secure: process.env.NODE_ENV === "production",
      sameSite: "lax", //strict  or for multiple origen none
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      /** for production **/ 
      // secure: true,
      // sameSite: "none"
    });


    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false,  message: "Internal server error" },
      { status: 500 }
    );
  }
}
