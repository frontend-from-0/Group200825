"use server";

import { put } from "@vercel/blob";
import type { Currency as DbCurrency, ProductCategory as DbProductCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { Currency, isCurrency } from "@/types/currency";
import { isProductCategory, ProductCategory } from "@/types/product";

const MAX_IMAGE_BYTES = 4.5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type CreateProductFormValues = {
  name: string;
  description: string;
  price: string;
  currency: Currency;
  category: ProductCategory;
  stock: string;
  isActive: boolean;
};

export type CreateProductFieldErrors = Partial<
  Record<keyof CreateProductFormValues | "images", string>
>;

export type CreateProductState =
  | { success: true; productId: string }
  | {
      success: false;
      message: string;
      fieldErrors?: CreateProductFieldErrors;
      values?: CreateProductFormValues;
    };

function parsePriceToCents(price: string): number | null {
  const normalized = price.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const majorUnits = Number(normalized);
  if (!Number.isFinite(majorUnits) || majorUnits <= 0) {
    return null;
  }

  return Math.round(majorUnits * 100);
}

function readFormValues(formData: FormData): CreateProductFormValues {
  const currencyRaw = String(formData.get("currency") ?? Currency.EUR);
  const categoryRaw = String(formData.get("category") ?? ProductCategory.OTHER);

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    currency: isCurrency(currencyRaw) ? currencyRaw : Currency.EUR,
    category: isProductCategory(categoryRaw)
      ? categoryRaw
      : ProductCategory.OTHER,
    stock: String(formData.get("stock") ?? "").trim(),
    isActive: formData.get("isActive") === "on",
  };
}

function validateForm(values: CreateProductFormValues, imageFiles: File[]) {
  const fieldErrors: CreateProductFieldErrors = {};

  if (!values.name) {
    fieldErrors.name = "Product name is required.";
  } else if (values.name.length > 120) {
    fieldErrors.name = "Product name must be 120 characters or fewer.";
  }

  if (!values.description) {
    fieldErrors.description = "Description is required.";
  } else if (values.description.length > 2000) {
    fieldErrors.description = "Description must be 2000 characters or fewer.";
  }

  const priceCents = parsePriceToCents(values.price);
  if (priceCents === null) {
    fieldErrors.price = "Enter a valid price with up to 2 decimal places.";
  }

  if (!isCurrency(values.currency)) {
    fieldErrors.currency = "Select a supported currency.";
  }

  if (!isProductCategory(values.category)) {
    fieldErrors.category = "Select a product category.";
  }

  const stock = Number(values.stock);
  if (!values.stock || Number.isNaN(stock)) {
    fieldErrors.stock = "Stock is required.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    fieldErrors.stock = "Stock must be a whole number of 0 or greater.";
  }

  const validImages = imageFiles.filter((file) => file.size > 0);
  if (validImages.length === 0) {
    fieldErrors.images = "Add at least one product image.";
  } else {
    for (const file of validImages) {
      if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        fieldErrors.images = "Images must be JPEG, PNG, WebP, or GIF.";
        break;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        fieldErrors.images = "Each image must be 4.5 MB or smaller.";
        break;
      }
    }
  }

  return {
    fieldErrors,
    priceCents: priceCents ?? 0,
    stock: Number.isInteger(stock) ? stock : 0,
    validImages,
  };
}

export async function createProduct(
  _prev: CreateProductState | null,
  formData: FormData,
): Promise<CreateProductState> {
  await requireAdmin();

  const values = readFormValues(formData);
  const imageFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File);

  const { fieldErrors, priceCents, stock, validImages } = validateForm(
    values,
    imageFiles,
  );

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  const imageUrls: string[] = [];

  try {
    for (const file of validImages) {
      const blob = await put(`products/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });

      imageUrls.push(blob.url);
    }

    const product = await prisma.product.create({
      data: {
        name: values.name,
        description: values.description,
        priceCents,
        currency: values.currency as DbCurrency,
        category: values.category as DbProductCategory,
        stock,
        imageUrls,
        isActive: values.isActive,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("createProduct failed:", error);

    return {
      success: false,
      message:
        "Something went wrong while saving the product. Check your database and Blob configuration.",
      values,
    };
  }
}
