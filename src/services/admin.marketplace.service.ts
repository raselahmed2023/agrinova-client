import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  IOrder,
  IProduct,
  ProductCategory,
  ProductStatus,
} from "@/types/marketplace";

export interface AdminProductQuery {
  page?: number;

  limit?: number;

  status?:
    | ProductStatus
    | "all";

  category?:
    | ProductCategory
    | "all";

  search?: string;
}

export interface AdminMarketplaceCounts {
  live: number;

  outOfStock: number;

  hidden: number;
}

export interface AdminProductListResult {
  data: IProduct[];

  meta: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;

    counts: AdminMarketplaceCounts;
  };
}

function buildQuery(
  params: Record<
    string,
    unknown
  >
) {
  const searchParams =
    new URLSearchParams();

  Object.entries(
    params
  ).forEach(
    ([key, value]) => {
      if (
        value !==
          undefined &&
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



async function getAdminProducts(
  params:
    AdminProductQuery = {}
): Promise<AdminProductListResult> {
  const response =
    await apiRequestWithMeta<
      IProduct[]
    >(
      "/admin/marketplace/products",

      "GET",

      undefined,

      buildQuery({
        page:
          params.page,

        limit:
          params.limit,

        status:
          params.status ===
          "all"
            ? undefined
            : params.status,

        category:
          params.category ===
          "all"
            ? undefined
            : params.category,

        search:
          params.search,
      })
    );

  const data =
    Array.isArray(
      response.data
    )
      ? response.data
      : [];

  const rawMeta =
    response.meta as
      | {
          page?: number;

          limit?: number;

          total?: number;

          totalPages?: number;

          counts?: {
            live?: number;

            outOfStock?: number;

            hidden?: number;
          };
        }
      | undefined;

  const rawCounts =
    rawMeta?.counts;

  return {
    data,

    meta: {
      page:
        Number(
          rawMeta?.page ||
            params.page ||
            1
        ),

      limit:
        Number(
          rawMeta?.limit ||
            params.limit ||
            12
        ),

      total:
        Number(
          rawMeta?.total ??
            data.length
        ),

      totalPages:
        Math.max(
          Number(
            rawMeta?.totalPages ||
              1
          ),
          1
        ),

      counts: {
        live:
          Number(
            rawCounts?.live ||
              0
          ),

        outOfStock:
          Number(
            rawCounts?.outOfStock ||
              0
          ),

        hidden:
          Number(
            rawCounts?.hidden ||
              0
          ),
      },
    },
  };
}

const getAdminProductById = (
  productId: string
) =>
  apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}`
  );



const moderateProduct = (
  productId: string,

  reason: string
) =>
  apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/moderate`,

    "PATCH",

    {
      reason,
    }
  );

const restoreProduct = (
  productId: string
) =>
  apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}/restore`,

    "PATCH"
  );

const removeProduct = (
  productId: string,

  reason: string
) =>
  apiRequest<IProduct>(
    `/admin/marketplace/products/${encodeURIComponent(
      productId
    )}`,

    "DELETE",

    {
      reason,
    }
  );



const getAdminOrders =
  () =>
    apiRequest<IOrder[]>(
      "/orders/admin/all"
    );



const updateAdminFulfillment =
  (
    orderId: string,

    sellerId: string,

    status:
      | "picked_up"
      | "out_for_delivery"
      | "delivered",

    deliveryPartner?: {
      name?: string;

      phone?: string;
    }
  ) =>
    apiRequest<IOrder>(
      `/orders/admin/${encodeURIComponent(
        orderId
      )}/fulfillment/${encodeURIComponent(
        sellerId
      )}`,

      "PATCH",

      {
        status,

        deliveryPartner,
      }
    );

export const marketplaceService = {
  getAdminProducts,

  getAdminProductById,

  moderateProduct,

  restoreProduct,

  removeProduct,

  getAdminOrders,

  updateAdminFulfillment,
};


export const MarketplaceService =
  marketplaceService;