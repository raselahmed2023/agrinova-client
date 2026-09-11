import { apiRequest } from "./api.client";

import type {
  IProduct,
  IProductListResponse,
  ProductCategory,
  ProductStatus,
} from "@/types/marketplace";

interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory | "all";
  status?: ProductStatus | "all";
  transactionType?: string;
  productionMethod?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface AdminProductQuery {
  page?: number;
  limit?: number;
  status?: ProductStatus | "all";
  category?: ProductCategory | "all";
  search?: string;
}

export interface AdminProductListResult {
  data: IProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildQuery(
  params: Record<string, unknown>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  return searchParams.toString();
}



async function getProducts(
  params: ProductQuery = {}
): Promise<
  IProduct[] | IProductListResponse
> {
  const queryString = buildQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    category:
      params.category === "all"
        ? undefined
        : params.category,
    status:
      params.status === "all"
        ? undefined
        : params.status,
    transactionType:
      params.transactionType,
    productionMethod:
      params.productionMethod,
    location: params.location,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
  });

  return apiRequest<
    IProduct[] | IProductListResponse
  >(
    "/marketplace/products",
    "GET",
    undefined,
    queryString
  );
}

async function getProductById(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      productId
    )}`
  );
}



async function getMyProducts(
  params: {
    page?: number;
    limit?: number;
    status?: ProductStatus | "all";
  } = {}
): Promise<
  IProduct[] | IProductListResponse
> {
  const queryString = buildQuery({
    page: params.page,
    limit: params.limit,
    status:
      params.status === "all"
        ? undefined
        : params.status,
  });

  return apiRequest<
    IProduct[] | IProductListResponse
  >(
    "/marketplace/my-listings",
    "GET",
    undefined,
    queryString
  );
}

async function createProduct(
  payload: IProduct
): Promise<IProduct> {
  return apiRequest<IProduct>(
    "/marketplace/products",
    "POST",
    payload
  );
}

async function updateProduct(
  productId: string,
  payload: Partial<IProduct>
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      productId
    )}`,
    "PATCH",
    payload
  );
}

async function deleteProduct(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      productId
    )}`,
    "DELETE"
  );
}



async function getAdminProducts(
  params: AdminProductQuery = {}
): Promise<AdminProductListResult> {
  const queryString = buildQuery({
    page: params.page,
    limit: params.limit,
    status:
      params.status === "all"
        ? undefined
        : params.status,
    category:
      params.category === "all"
        ? undefined
        : params.category,
    search: params.search,
  });

  return apiRequest<AdminProductListResult>(
    "/admin/marketplace/products",
    "GET",
    undefined,
    queryString
  );
}

async function getAdminProductById(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}`
  );
}

async function approveProduct(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/approve`,
    "PATCH"
  );
}

async function rejectProduct(
  productId: string,
  reason: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/reject`,
    "PATCH",
    {
      reason,
    }
  );
}

async function disableProduct(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/disable`,
    "PATCH"
  );
}

async function restoreProduct(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/restore`,
    "PATCH"
  );
}

async function removeProduct(
  productId: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}`,
    "DELETE"
  );
}


export const MarketplaceService = {
  // Public
  getProducts,
  getProductById,

  // Farmer / Seller
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  // Admin
  getAdminProducts,
  getAdminProductById,
  approveProduct,
  rejectProduct,
  disableProduct,
  restoreProduct,
  removeProduct,
};

// Backward-compatible lowercase export
export const marketplaceService =
  MarketplaceService;