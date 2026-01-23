import mongoose, { Schema } from "mongoose";
import { type IUserProfile } from "../types/index.js";

const UserSchema: Schema = new Schema(
  {
    authId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },

    profile: {
      firstName: { type: String },
      lastName: { type: String },
      avatarUrl: { type: String },
      phone: { type: String },
    },

    preferences: {
      currency: { type: String, default: "USD" },
      language: { type: String, default: "en" },
      marketingEmails: { type: Boolean, default: true },
    },

    addresses: [
      {
        label: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "DELETED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

const User = mongoose.model<IUserProfile>("User", UserSchema);
export default User;
