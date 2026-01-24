import joi from "joi";

export const ProductCreationSchema = joi.object({
  name: joi.string().required().max(50),
  description: joi.string().required().max(255),
  basePrice: joi.number().integer().min(0).max(9999999).required(),
  categories: joi
    .array()
    .items(joi.string().trim().min(2).max(30))
    .min(1)
    .max(5)
    .unique()
    .required(),
  images: joi.array().min(1).max(10).unique().required(),
});
