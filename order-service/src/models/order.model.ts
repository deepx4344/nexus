import mongoose, { Schema } from "mongoose";
import { type IOrder } from "../types/index.js";

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    idempotencyKey: { type: String, unique: true, sparse: true }, // Sparse index allows nulls
    
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
        sku: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    
    amounts: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    
    status: {
      type: String,
      enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    
    expiresAt: { type: Date, index: { expires: 0 } }, // TTL index: auto-delete if unpaid
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
