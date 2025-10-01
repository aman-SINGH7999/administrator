// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const profile: any = user.profile || {};
    console.log("user: ",otp)
    console.log("otp: ",profile.resetOtp)
    if (!profile.resetOtp || profile.resetOtp !== otp.toString()) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    if (!profile.resetOtpExpiry || Date.now() > profile.resetOtpExpiry) {
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear OTP
    delete profile.resetOtp;
    delete profile.resetOtpExpiry;
    user.profile = profile;

    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
