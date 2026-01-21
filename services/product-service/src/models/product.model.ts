import mongoose, { Schema } from "mongoose";
import { type IProduct } from "../types/index.js";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0 },
    categories: [{ type: String, index: true }],
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    images: [String],
    variants: [
      {
        sku: { type: String, required: true },
        price: { type: Number, required: true }, 
        stock: { type: Number, required: true, min: 0 },
        attributes: { type: Map, of: String },
      },
    ],
    stats: {
      averageRating: { type: Number, default: 0, index: true },
      reviewCount: { type: Number, default: 0 },
      soldCount: { type: Number, default: 0, index: true },
    },
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

ProductSchema.index({ categories: 1, "stats.soldCount": -1 });

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
