import { type Document } from "mongoose";

export interface IUserAddress {
  label: string; // e.g. "Home", "Work"
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUserProfile extends Document {
  authId: string; // Link to Auth Service
  email: string;
  
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    phone?: string;
  };
  
  preferences: {
    currency: string;
    language: string;
    marketingEmails: boolean;
  };
  
  addresses: IUserAddress[];
  
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
}
