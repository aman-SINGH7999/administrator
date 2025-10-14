// src/app/api/schools/[id]/employees/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";
import { sendEmail } from "@/lib/mailer";
import EmployeeRegistrationTemplate from "@/components/mails/EmployeeRegistrationTemplate";
import { checkRole, generatePassword } from "@/lib/utils";
import bcrypt from'bcrypt'
import { IUser } from "@/types/user";
import mongoose, { FilterQuery } from "mongoose";
import { verifyAuth } from "@/lib/auth";

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);
  const { id } = params;
  try {
    await connectDB();

    if (!id) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400, headers: corsHeaders });
    }

    // 🔹 Query params: pagination + search
    const { searchValue = "", page = "1", limit = "10" } = Object.fromEntries(req.nextUrl.searchParams);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // 🔹 Filter
    const query: FilterQuery<IUser> = {
      schoolId: new mongoose.Types.ObjectId(id),
      role: { $in: ["school_admin", "teacher", "staff"] },
    };

    // 🔹 Search filter
    if (searchValue.trim()) {
      const safeSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { "teacher.subjectSpecialization": searchRegex },
        { "staff.department": searchRegex },
      ];
    }

    // 🔹 Total count for pagination
    const total = await User.countDocuments(query);

    // 🔹 Fetch employees with pagination
    const employees = await User.find(query)
      .select("-password -resetOtp")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return NextResponse.json(
      {
        success: true,
        employees,
        pagination: { total, totalPages, currentPage: pageNum },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("Error fetching employees:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}



// POST register employee
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);
  const { id } = params;
  console.log("Chal ja chutiye")

  const auth = await verifyAuth(req);
   if (auth instanceof NextResponse) return auth;
   const craterRole = auth.role;
    
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, role, gender, subjects, department, moreInfo } = body;

    if (!checkRole(craterRole, ["super_admin", "admin", "school_admin", "staff"])) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403, headers: corsHeaders });
    }

    // Validate required fields
    if ( !name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate role
    if (!["teacher", "staff"].includes(role.toLowerCase())) {
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
      schoolId: new mongoose.Types.ObjectId(id),
      name,
      email,
      password: hashedPassword,
      role:role.toLowerCase(),
      profile: {
        phone,
        gender: gender?.toLowerCase(),
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
