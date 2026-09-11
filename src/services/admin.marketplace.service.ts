import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  IProduct,
  ProductCategory,
  ProductStatus,
} from "@/types/marketplace";

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

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
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

  const response = await apiRequestWithMeta<IProduct[]>(
    "/admin/marketplace/products",
    "GET",
    undefined,
    queryString
  );

  const data = Array.isArray(response.data)
    ? response.data
    : [];

  return {
    data,
    meta: {
      page: Number(response.meta?.page || params.page || 1),
      limit: Number(response.meta?.limit || params.limit || 10),
      total: Number(response.meta?.total ?? data.length),
      totalPages: Math.max(
        Number(response.meta?.totalPages || 1),
        1
      ),
    },
  };
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
    { reason }
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
  getAdminProducts,
  getAdminProductById,
  approveProduct,
  rejectProduct,
  disableProduct,
  restoreProduct,
  removeProduct,
};

export const marketplaceService = MarketplaceService;