import mongoose, { Schema } from "mongoose";
import { type IAuthUser } from "../types/index.js";

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model<IAuthUser>("user", usersSchema);
export default Users;
