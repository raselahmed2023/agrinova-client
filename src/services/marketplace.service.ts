import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

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

  Object.entries(
    params
  ).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !==
          ""
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

function normalizeListResponse(
  data: IProduct[],
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  }
): IProductListResponse {
  return {
    data:
      Array.isArray(data)
        ? data
        : [],

    meta: {
      page:
        Number(
          meta?.page || 1
        ),

      limit:
        Number(
          meta?.limit ||
            data?.length ||
            1
        ),

      total:
        Number(
          meta?.total ??
            data?.length ??
            0
        ),

      totalPages:
        Math.max(
          Number(
            meta?.totalPages ||
              1
          ),
          1
        ),
    },
  };
}

export async function getProductsPage(
  params: MarketplaceQuery = {}
): Promise<IProductListResponse> {
  const response =
    await apiRequestWithMeta<
      IProduct[]
    >(
      "/marketplace/products",
      "GET",
      undefined,
      buildQuery(params)
    );

  return normalizeListResponse(
    response.data,
    response.meta
  );
}

export async function getProducts(
  params: MarketplaceQuery = {}
): Promise<IProduct[]> {
  return (
    await getProductsPage(
      params
    )
  ).data;
}

export async function getProductById(
  id: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      id
    )}`
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

export async function getMyProductsPage(
  params: MarketplaceQuery = {}
): Promise<IProductListResponse> {
  const response =
    await apiRequestWithMeta<
      IProduct[]
    >(
      "/marketplace/my-listings",
      "GET",
      undefined,
      buildQuery(params)
    );

  return normalizeListResponse(
    response.data,
    response.meta
  );
}

export async function getMyProducts(
  params: MarketplaceQuery = {}
): Promise<IProduct[]> {
  return (
    await getMyProductsPage(
      params
    )
  ).data;
}

export async function getMyProductById(
  id: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/my-listings/${encodeURIComponent(
      id
    )}`
  );
}

export async function updateProduct(
  id: string,
  data: Partial<ICreateProduct>
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      id
    )}`,
    "PATCH",
    data
  );
}

export async function deleteProduct(
  id: string
): Promise<IProduct> {
  return apiRequest<IProduct>(
    `/marketplace/products/${encodeURIComponent(
      id
    )}`,
    "DELETE"
  );
}

export const MarketplaceService = {
  getProducts,
  getProductsPage,
  getProductById,
  createProduct,
  getMyProducts,
  getMyProductsPage,
  getMyProductById,
  updateProduct,
  deleteProduct,
};