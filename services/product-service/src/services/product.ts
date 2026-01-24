import { createServiceError, slugify } from "@nexus/shared";
import type {
  IProduct,
  IProductVariant,
  ProductCreationDto,
  updateVariant,
} from "../types/index.js";
import Product from "../models/product.model.js";

class productService {
  private generateSlugAndEnforceUniqueness = async (
    name: string
  ): Promise<string> => {
    const slug: string = slugify(name);
    let counter: number = 0;
    let finalSlug = slug;
    while (await Product.findOne({ slug: finalSlug })) {
      counter++;
      finalSlug = `${finalSlug}-${counter}`;
    }
    return finalSlug;
  };
  addBaseProduct = async (data: ProductCreationDto): Promise<void> => {
    const slug = this.generateSlugAndEnforceUniqueness(data.name);
    let product = new Product({
      name: data.name,
      slug: slug,
      description: data.description,
      basePrice: data.basePrice,
      categories: data.categories,
      images: data.images,
    });
    await product.save();
  };
  addProductVariants = async (
    productId: string,
    data: IProductVariant[]
  ): Promise<void> => {
    await Product.findByIdAndUpdate(productId, {
      $push: {
        variants: {
          $each: data,
        },
      },
      status: "ACTIVE",
    });
  };
  getProductById = async (productId: string): Promise<IProduct> => {
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw createServiceError(
        `Product with id of ${productId} not found.`,
        404
      );
    }
    return product;
  };
  getAllProducts = async (limit: number, page: number): Promise<IProduct[]> => {
    const products = await Product.find().skip(page).limit(limit).lean();
    return products || [];
  };
  searchProduct = async (searchValue: string): Promise<IProduct[]> => {
    const products = await Product.find({
      name: { $regex: `^${searchValue}`, $options: "i" },
      status: "ACTIVE",
      flagForDelete: false,
    })
      .limit(15)
      .lean();
    return products;
  };
  updateProductStatus = async (
    productId: string,
    status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  ): Promise<IProduct> => {
    const product = await Product.findByIdAndUpdate(productId, {
      status: status,
    });
    if (!product) {
      throw createServiceError(
        `Product with Id of ${productId} not found`,
        404
      );
    }
    return product;
  };
  deleteProduct = async (productId: string): Promise<void> => {
    const product = await Product.findByIdAndUpdate(productId, {
      flagForDelete: true,
    });
    if (!product) {
      throw createServiceError(
        `Product with Id of ${productId} not found`,
        404
      );
    }
  };
}
