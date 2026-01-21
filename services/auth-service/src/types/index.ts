import { type Document } from "mongoose";

export interface IAuthUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because selected: false by default
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
