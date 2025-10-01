// src/types/school.d.ts
import { Document, Types } from "mongoose";

export interface ISchool extends Document {
  name: string;
  type: "school" | "e-school";
  registerId: string; // e.g., SCH-1001
  email: string;
  phone: string;
  address?: string;
  createdBy?: Types.ObjectId; // ref to User
  createdAt: Date;
  updatedAt: Date;
}
