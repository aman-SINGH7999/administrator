// src/models/School.ts
import mongoose, { Schema, Model } from "mongoose";
import { ISchool } from "@/types/school";

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["school", "e-school"], required: true },

    registerId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String },
    address: { type: String },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Duplicate model problem se bachne ke liye:
export const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);
