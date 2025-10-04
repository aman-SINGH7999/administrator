import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // apna DB connect function
import { School } from "@/models/School";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, owner, email, phone, address, city, state } = body;
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');

    if (!name || !owner || !email || !phone || !city || !state ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    console.log("role: ", role);
    console.log("userId: ", userId);

    if(role !== "admin" && role !== "super_admin"){
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 400 }
      );
    }

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
      createdBy : userId,
    });

    sendEmail(email, "School registration", "Your school is registered");
    return NextResponse.json({ success: true, data: newSchool }, { status: 201 });
  } catch (error: any) {
    console.error("Register school error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
