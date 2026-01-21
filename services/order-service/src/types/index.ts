import { type Document, type Types } from "mongoose";

export interface IOrderSnapshot {
  productId: Types.ObjectId;
  sku: string;
  name: string; // Snapshot if product is deleted
  price: number; // Snapshot of price at purchase time
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: string; // Reference to central User ID
  idempotencyKey?: string; // Prevent duplicate orders
  
  items: IOrderSnapshot[];
  
  amounts: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  
  // Immutabile snapshot of shipping details
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  
  // Audit trail for status changes
  timeline: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;

  expiresAt?: Date; // For reservation timeouts
}
