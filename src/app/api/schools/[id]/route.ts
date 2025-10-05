// src/app/api/schools/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { School } from "@/models/School";
import { checkRole } from "@/lib/utils";
import { ISchool } from "@/types/school";


// Get the school detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const role = req.headers.get('x-user-role');
    if (!checkRole(role, ["admin", "super_admin", "school_admin", "teacher", "staff"])) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const school = await School.findById(id).populate("createdBy", "name email");
    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: school }, { status: 200 });
  } catch (error) {
    console.error("Get school error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch school" },
      { status: 500 }
    );
  }
}

// update the school
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const role = req.headers.get("x-user-role");
    if (!checkRole(role, ["admin", "super_admin"])) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const updateData: Partial<ISchool> = {};

    // Allowed fields for everyone
    const allowedFields = ["name", "owner", "phone", "address", "city", "state", "otherInfo"] as const;
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) updateData[field] = body[field];
    });

    // Email can be updated only by super_admin
    if (body.email && role === "super_admin") {
      updateData.email = body.email;
    }

    // Status update allowed, but "delete" is never allowed
    const allowedStatuses = ["active", "inactive", "pending", "suspended"];
    if (body.status && allowedStatuses.includes(body.status)) {
      updateData.status = body.status;
    }

    const updatedSchool = await School.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedSchool) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedSchool }, { status: 200 });

  } catch (error: unknown) {
    console.error("Update school error:", error);
    let message = "Failed to update school";
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}


// Delete School
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const role = req.headers.get("x-user-role");
    if (!checkRole(role, ["super_admin"])) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    // Physical delete, status update
    const updated = await School.findByIdAndUpdate(
      id,
      { status: "delete" },
      { new: true } 
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "School marked as deleted", data: updated }, { status: 200 });
  } catch (error: unknown) {
    console.error("Soft delete school error:", error);

    let message = "Failed to delete school";
    if (error instanceof Error) message = error.message;

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
