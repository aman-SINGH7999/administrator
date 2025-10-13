// src/app/api/employee/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/mailer";
import EmployeeRegistrationTemplate from "@/components/mails/EmployeeRegistrationTemplate";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";
import { IUser } from "@/types/user";

// Random password generator
function generatePassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// OPTIONS preflight
export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

// POST register employee
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  try {
    await connectDB();
    const body = await req.json();
    const { schoolId, name, email, phone, role, gender, subjects, department, moreInfo } = body;

    // Validate required fields
    if (!schoolId || !name || !email || !phone || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate role
    if (!["teacher", "staff"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400, headers: corsHeaders });
    }

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400, headers: corsHeaders });
    }

    // Generate password
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user data
    const userData: IUser = {
      schoolId,
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        phone,
        gender,
        moreInfo,
      },
    };

    // Teacher or Staff specific fields
    if (role === "teacher") {
      userData.teacher = { subjectSpecialization: subjects || [] };
    }
    if (role === "staff") {
      userData.staff = { department: department || "" };
    }

    const user = await User.create(userData);

    // Send email with temporary password
    await sendEmail(email, "Your Employee Account", EmployeeRegistrationTemplate(name, role, plainPassword));

    // Return user object **without password**
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password:_, ...safeUser } = user.toObject();

    return NextResponse.json(
      { message: "Employee registered successfully", user: safeUser },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Employee registration error:", err.message);
    else console.error("Employee registration error:", err);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: corsHeaders }
    );
  }
}
