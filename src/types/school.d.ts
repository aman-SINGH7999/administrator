// src/types/school.d.ts
import { Types } from "mongoose";

export interface ISchool {
  _id?: Types.ObjectId;
  name: string;
  owner: string;
  schoolCode: string; // e.g., SCH-1001
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?:string;
  status?: "active" | "inactive" | "pending" | "suspended" | "delete";
  otherInfo?: string;
  createdBy?: Types.ObjectId; // ref to User
  createdAt?: Date;
  updatedAt?: Date;
}
