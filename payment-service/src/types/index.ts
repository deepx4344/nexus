import { type Document } from "mongoose";

export interface IPayment extends Document {
  userId: string;
  orderId: string; // Loose ref to Order Service ID
  
  amount: number;
  currency: string;
  
  provider: "STRIPE" | "PAYPAL" | "MOCK";
  providerTransactionId?: string;
  
  status: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  
  // Store raw gateway response for debugging
  metadata: Map<string, any>;
  
  // Audit log of gateway interactions
  events: Array<{
    type: string;
    details: any;
    timestamp: Date;
  }>;
}
