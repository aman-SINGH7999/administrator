// src/models/User.ts
import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "@/types/user";

const UserSchema = new Schema<IUser>(
  {
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "School",
        required: function () {
            return !["super_admin", "admin"].includes(this.role);
        },
    },

    name: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      required: function () {
        return this.role !== "student";
      },
    },

    rollNo: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === "student";
      },
    },

    password: { type: String, required: true, minlength: 8 },

    role: {
      type: String,
      enum: ["super_admin", "admin", "school_admin", "teacher", "student", "staff"],
      required: true,
    },

    // Student-specific
    student: {
      class: String,
      section: String,
      admissionNo: String,
      dob: {
        type: Date,
        required: function () {
          return this.role === "student";
        },
      },
    },

    // Teacher-specific
    teacher: {
      employeeId: String,
      subjectSpecialization: [String],
    },

    // Staff-specific
    staff: {
      employeeId: String,
      department: String,
    },

    profile: {
      avatar: String,
      phone: String,
      gender: { type: String, enum: ["male", "female", "other"] },
    },
    resetOtp: {type: String},
    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


// Duplicate model problem se bachne ke liye
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
