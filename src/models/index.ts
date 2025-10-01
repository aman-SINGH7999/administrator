// src/models/index.ts
import "./School";
import "./User";

import mongoose from "mongoose";

// Export registered models
export const School = mongoose.models.School;
export const User = mongoose.models.User;
