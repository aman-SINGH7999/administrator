import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { getCorsHeaders, handlePreflight } from "@/lib/cors";
import { verifyAuth } from "@/lib/auth";
import { checkRole, dateDMYFormate } from "@/lib/utils";

type RawStudent = {
  name: string;
  rollNo: string;
  standard: string;
  section: string;
  dob: string;
  gender: string;
  moreInfo?: string;
};


export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);
  const { id } = params;

  const auth = await verifyAuth(req);
  if (auth instanceof NextResponse) return auth;
  const creatorRole = auth.role;

  try {
    await connectDB();
    const body = await req.json();
    const students = body?.students;
    console.log("STUDENTS: ", body);

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "No students provided" }, { status: 400, headers: corsHeaders });
    }

    if (!checkRole(creatorRole, ["super_admin", "admin", "school_admin", "staff", "teacher"])) {
      return NextResponse.json({ error: "Access denied" }, { status: 403, headers: corsHeaders });
    }

    const schoolId = new mongoose.Types.ObjectId(id);
    const today = new Date();

    // 1) sanitize & normalize, collect rollNos
    const normalized = students.map((s: RawStudent) => ({
      name: (s.name || "").toString().trim(),
      rollNo: (s.rollNo || "").toString().trim(),
      standard: (s.standard || "").toString().trim(),
      section: (s.section || "").toString().trim(),
      dob: (s.dob || "").toString().trim(),
      gender: (s.gender || "").toString().trim().toLowerCase(),
      moreInfo: s.moreInfo || "",
    }));

    // 2) basic server-side validation & filter invalid rows
    const validDocs: RawStudent[] = [];
    for (const r of normalized) {
      if (!r.name || !r.rollNo || !r.standard || !r.section || !r.dob || !r.gender) continue;
      const d = new Date(r.dob);
      if (isNaN(d.getTime()) || d > today) continue;
      validDocs.push(r);
    }
    if (validDocs.length === 0) {
      return NextResponse.json({ error: "No valid student rows found" }, { status: 400, headers: corsHeaders });
    }

    // 3) check existing rollNos in one query
    const rollNos = validDocs.map((d) => d.rollNo);
    const existing = await User.find({ schoolId, rollNo: { $in: rollNos } }).select("rollNo").lean();
    const existingRolls = new Set(existing.map((e) => e.rollNo));

    // 4) prepare insert docs (filter duplicates)
    const docsToInsert: (RawStudent & { plainPassword: string })[] = [];
    for (const r of validDocs) {
      if (existingRolls.has(r.rollNo)) continue; // skip duplicates
        if (!r.dob) continue;
      const plain = dateDMYFormate(r?.dob);
      // hash password now (we'll hash later in parallel)
      docsToInsert.push({ ...r, plainPassword: plain });
    }

    if (docsToInsert.length === 0) {
      return NextResponse.json({ error: "No new students to insert (all duplicates or invalid)" }, { status: 400, headers: corsHeaders });
    }

    // 5) hash passwords in parallel (Promise.all)
    const hashedPairs = await Promise.all(
      docsToInsert.map(async (d) => {
        const hashed = await bcrypt.hash(d.plainPassword, 10);
        return { ...d, password: hashed };
      })
    );

    // 6) create final documents for insertMany
    const finalDocs = hashedPairs.map((d) => ({
      schoolId,
      name: d.name,
      rollNo: d.rollNo,
      student: {
        standard: d.standard,
        section: d.section,
        dob: d.dob,
      },
      role: "student",
      password: d.password,
      profile: {
        gender: d.gender,
        moreInfo: d.moreInfo,
      },
    }));

    // 7) perform insertMany (ordered:false so duplicates won't abort)
    const inserted = await User.insertMany(finalDocs, { ordered: false });

    return NextResponse.json(
      { success: true, count: inserted.length, message: `${inserted.length} students inserted` },
      { status: 201, headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("Bulk insert error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
