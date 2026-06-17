import type { Prisma, ProductCategory as DbProductCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  isProductCategory,
  isProductSort,
  ProductSort,
  type ProductCategory,
} from "@/types/product";

export type StorefrontProductFilters = {
  category?: string;
  sort?: string;
};

function parseCategoryFilter(category?: string): ProductCategory | "all" {
  if (!category || category === "all") {
    return "all";
  }

  return isProductCategory(category) ? category : "all";
}

function parseSort(sort?: string): ProductSort {
  if (sort && isProductSort(sort)) {
    return sort;
  }

  return ProductSort.NAME_ASC;
}

function getOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case ProductSort.NAME_DESC:
      return { name: "desc" };
    case ProductSort.PRICE_ASC:
      return { priceCents: "asc" };
    case ProductSort.PRICE_DESC:
      return { priceCents: "desc" };
    case ProductSort.NAME_ASC:
      return { name: "asc" };
    default: {
      const exhaustiveCheck: never = sort;
      return exhaustiveCheck;
    }
  }
}

export async function getStorefrontProducts(filters: StorefrontProductFilters = {}) {
  const category = parseCategoryFilter(filters.category);
  const sort = parseSort(filters.sort);

  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category !== "all" ? { category: category as DbProductCategory } : {}),
      },
      orderBy: getOrderBy(sort),
    });
  } catch (error) {
    console.error("getStorefrontProducts failed:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getAllProducts failed:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export function parseStorefrontFilters(
  searchParams: Record<string, string | string[] | undefined>,
): StorefrontProductFilters & { categoryValue: ProductCategory | "all"; sortValue: ProductSort } {
  const categoryRaw = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category;
  const sortRaw = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort;

  const categoryValue = parseCategoryFilter(categoryRaw);
  const sortValue = parseSort(sortRaw);

  return {
    category: categoryRaw,
    sort: sortRaw,
    categoryValue,
    sortValue,
  };
}
