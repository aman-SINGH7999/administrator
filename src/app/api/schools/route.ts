import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // apna DB connect function
import { School } from "@/models/School";
import { sendEmail } from "@/lib/mailer";
import { checkRole } from "@/lib/utils";
import type { FilterQuery } from "mongoose";
import type { ISchool } from "@/types/school";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, owner, email, phone, address, city, state } = body;
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    if (!checkRole(role, ["admin", "super_admin"])) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    if (!name || !owner || !email || !phone || !city || !state ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    console.log("role: ", role);
    console.log("userId: ", userId);



    const count = await School.countDocuments() + 1000;

    const schoolCode = state?.[0]+city?.[0]+name?.[0]+'-'+ count;

    // Check if school already exists
    const existing = await School.findOne({
      $or: [{ email }, { schoolCode }],
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "School with this email or code already exists." },
        { status: 400 }
      );
    }

    const newSchool = await School.create({
      name,
      owner,
      schoolCode,
      email,
      phone,
      address,
      city,
      state,
      status: "pending",
      createdBy : userId,
    });

    await sendEmail(email, "School registration", "Your school is registered");
    return NextResponse.json({ success: true, data: newSchool }, { status: 201 });
  } catch (error) {
    console.error("Register school error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}


// get All schools
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const role = req.headers.get('x-user-role');
    if (!checkRole(role, ["admin", "super_admin", "school_admin", "teacher", "staff"])) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const searchValue = searchParams.get("searchValue");
    const city = searchParams.get("city");
    const state = searchParams.get("state");

    // ✅ pagination params
    const page = parseInt(searchParams.get("page") || "1", 10); // default page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // default 10 records
    const skip = (page - 1) * limit;


    const query: FilterQuery<ISchool> = {status: { $ne: "delete" }};

    if (searchValue) {
      query.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { owner: { $regex: searchValue, $options: "i" } },
        { address: { $regex: searchValue, $options: "i" } },
      ];
    }
    if (city) query.city = city;
    if (state) query.state = state;

    const total = await School.countDocuments(query);
    const schools = await School.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest schools first

    return NextResponse.json({ 
      success: true, 
      data: schools,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Get schools error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}