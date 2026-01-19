import mongoose, { Schema } from "mongoose";
import { type IPayment } from "../types/index.js";

const PaymentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },
    
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD", required: true },
    
    provider: { type: String, enum: ["STRIPE", "PAYPAL", "MOCK"], required: true },
    providerTransactionId: { type: String, index: true },
    
    status: {
      type: String,
      enum: ["PENDING", "AUTHORIZED", "CAPTURED", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    
    metadata: { type: Map, of: Schema.Types.Mixed },
    
    events: [
      {
        type: { type: String, required: true },
        details: { type: Schema.Types.Mixed },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
