// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";
import OtpEmailTemplate from "@/components/mails/OtpEmailTemplate";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";

// const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// OPTIONS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}



export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400, headers: corsHeaders });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Email not found" }, { status: 404, headers: corsHeaders });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP & expiry in user document (expires in 10 min)
    const expiry = Date.now() + 5 * 60 * 1000;
    user.resetOtp = otp + expiry.toString();
    // user.profile = user.profile || {};
    // (user.profile as any).resetOtp = otp;
    // (user.profile as any).resetOtpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP email
    await sendEmail(email,"OTP for Password Reset", OtpEmailTemplate(otp) )

    return NextResponse.json({ success: true, message: "OTP sent to your email" },{ status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}


export async function PUT(req: NextRequest) {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);
  try {
    await connectDB();

    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400, headers: corsHeaders });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404, headers: corsHeaders });
    }

    console.log("user details: ", user);
    const savedOtp = user?.resetOtp?.slice(0, 6);
    const savedExpiry = Number(user?.resetOtp?.slice(6));

    console.log("user: ",otp)
    console.log("otp: ",savedOtp)

    if (!savedOtp || savedOtp !== otp.toString()) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400, headers: corsHeaders });
    }

    if (!savedExpiry || Date.now() > savedExpiry) {
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400, headers: corsHeaders });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;

    await user.save();

    return NextResponse.json({ success: true, message: "Password reset successful" }, {status:200, headers: corsHeaders});
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
