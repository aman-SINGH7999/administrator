// src/types/user.d.ts
import { Types } from "mongoose";

// Base fields common to all users
export interface IUserBase {
  schoolId: Types.ObjectId;
  name: string;
  email?: string; // optional for students
  password: string;
  role: "super_admin" | "admin" | "school_admin" | "teacher" | "student" | "staff";
  lastLogin?: Date;
  isActive?: boolean;
  profile?: {
    avatar?: string;
    phone?: string;
    dob?: Date;
    gender?: "male" | "female" | "other";
  };
}

// Student-specific fields
export interface IStudentFields {
  student: {
    class?: string;
    section?: string;
    admissionNo?: string;
    dob: Date; // required for students
  };
  rollNo: string; // required for students
}

// Teacher-specific fields
export interface ITeacherFields {
  teacher: {
    employeeId?: string;
    subjectSpecialization?: string[];
  };
}

// Staff-specific fields
export interface IStaffFields {
  staff: {
    employeeId?: string;
    department?: string;
  };
}

// Complete user type based on role
export type IUser =
  | (IUserBase & IStudentFields & { role: "student" })
  | (IUserBase & ITeacherFields & { role: "teacher" })
  | (IUserBase & IStaffFields & { role: "staff" })
  | (IUserBase & { role: "school_admin" });
