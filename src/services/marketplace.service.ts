import { apiRequest } from "./api.client";

import type {
  ICreateProduct,
  IProduct,
  IProductListResponse,
} from "@/types/marketplace";

export interface MarketplaceQuery {
  search?: string;

  category?: string;

  location?: string;

  district?: string;

  transactionType?: string;

  productionMethod?: string;

  minPrice?: number | string;

  maxPrice?: number | string;

  sort?: string;

  page?: number;

  limit?: number;

  status?: string;
}

function buildQuery(
  params: MarketplaceQuery
) {
  const query =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        query.set(
          key,
          String(value)
        );
      }
    }
  );

  return query.toString();
}

export async function getProducts(
  params: MarketplaceQuery = {}
): Promise<IProductListResponse> {
  return apiRequest<IProductListResponse>(
    "/marketplace/products",
    "GET",
    undefined,
    buildQuery(params)
  );
}

export async function getProductById(
  id: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${id}`
  );
}

export async function createProduct(
  data: ICreateProduct
): Promise<IProduct> {
  return apiRequest<IProduct>(
    "/marketplace/products",
    "POST",
    data
  );
}

export async function getMyProducts(
  params: MarketplaceQuery = {}
): Promise<IProductListResponse> {
  return apiRequest<IProductListResponse>(
    "/marketplace/my-listings",
    "GET",
    undefined,
    buildQuery(params)
  );
}

export async function updateProduct(
  id: string,
  data: Partial<ICreateProduct>
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${id}`,
    "PATCH",
    data
  );
}

export async function deleteProduct(
  id: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${id}`,
    "DELETE"
  );
}

export const MarketplaceService = {
  getProducts,

  getProductById,

  createProduct,

  getMyProducts,

  updateProduct,

  deleteProduct,
};