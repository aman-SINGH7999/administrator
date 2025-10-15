// src/app/api/schools/[id]/students/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";
import { checkRole } from "@/lib/utils";
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

   // 🔹 Extract query parameters
    const { searchValue = "", page = "1", limit = "10", standard = "", section = "" } = Object.fromEntries(req.nextUrl.searchParams);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // 🔹 Base query (only students for given school)
    const query: FilterQuery<IUser> = {
      schoolId: new mongoose.Types.ObjectId(id),
      role: "student",
    };


    // 🔹 Filter by class (standard) & section if provided
    if (standard) query["student.standard"] = standard;
    if (section) query["student.section"] = section;


    // 🔹 Search filter
    if (searchValue.trim()) {
      const safeSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { rollNo: searchRegex },
        { "student.admissionNo": searchRegex },
      ];
    }

    // 🔹 Total count for pagination
    const total = await User.countDocuments(query);

    // 🔹 Fetch employees with pagination
    const students = await User.find(query)
      .select("-password -resetOtp")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return NextResponse.json(
      {
        success: true,
        students,
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
  console.log("Chal ja LoL")

  const auth = await verifyAuth(req);
   if (auth instanceof NextResponse) return auth;
   const craterRole = auth.role;
    
  try {
    await connectDB();
    const body = await req.json();
    console.log("body: ", body)
    const { name, standard, section, rollNo, dob, gender, moreInfo } = body;

    if (!checkRole(craterRole, ["super_admin", "admin", "school_admin", "staff", "teacher"])) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403, headers: corsHeaders });
    }

    // Validate required fields
    if ( !name || !standard || !section || !rollNo || !dob || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    
    // Check duplicate rollNo
    const existing = await User.findOne({ schoolId: id, rollNo });
    if (existing) {
      return NextResponse.json({ error: "Roll No. already registered" }, { status: 400, headers: corsHeaders });
    }

    // Generate password
    const dateObj = new Date(dob);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const plainPassword = `${day}${month}${year}`;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user data
    const userData: IUser = {
      schoolId: new mongoose.Types.ObjectId(id),
      name,
      rollNo,
      student: {
        standard,
        section,
        dob,
      },
      password: hashedPassword,
      role: "student",
      profile: {
        gender: gender?.toLowerCase(),
        moreInfo,
      },
    };


    const user = await User.create(userData);

    // Return user object **without password**
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password:_, ...safeUser } = user.toObject();

    return NextResponse.json(
      { success: true, message: "Student registered successfully", user: safeUser },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Student registration error:", err.message);
    else console.error("Student registration error:", err);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: corsHeaders }
    );
  }
}
