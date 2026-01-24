import { type Document } from "mongoose";

export interface IProductVariant {
  sku: string;
  price: number;
  stock: number;
  attributes: Map<string, string>;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categories: string[];
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  images: string[];

  variants: IProductVariant[];

  stats: {
    averageRating: number;
    reviewCount: number;
    soldCount: number;
  };
  flagForDelete: boolean;

  createdAt: Date;
  updatedAt: Date;
}
export interface ProductCreationDto {
  name: string;
  description: string;
  basePrice: number;
  categories: string[];
  images: string[];
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
}
  export interface updateVariant{
    price: number;
    stock: number;
    attributes: Map<string, string>;
  }
