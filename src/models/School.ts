// src/models/School.ts
import mongoose, { Schema, Model } from "mongoose";
import { ISchool } from "@/types/school";

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: String, required: true },
    schoolCode: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    phone: { type: String, required:true },
    address: { type: String },
    city: { type:String, required:true },
    state: { type:String, required:true },
    status: { 
      type: String, 
      enum: ["active", "inactive", "pending", "suspended", "delete"], 
      default: "pending" 
    },
    otherInfo: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required:true },
  },
  { timestamps: true }
);

// Duplicate model problem se bachne ke liye:
export const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);
