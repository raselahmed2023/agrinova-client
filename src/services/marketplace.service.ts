import { authClient } from "@/lib/auth-client";

import type {
  CreateProductPayload,
  MarketplaceProduct,
  ProductResponse,
  ProductsResponse,
  PurchaseRequestResponse,
  PurchaseRequestsResponse,
  PurchaseRequestStatus,
} from "@/types/marketplace";

const getApiUrl = () => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  return API_URL;
};


const getAuthToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required.");
  }

  return data.token;
};

interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

export const getMarketplaceProducts = async ({
  page = 1,
  limit = 8,
  search = "",
  category = "all",
  sort = "newest",
}: GetProductsParams): Promise<ProductsResponse> => {
  const API_URL = getApiUrl();

  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (
    category &&
    category !== "all"
  ) {
    params.set("category", category);
  }

  if (sort) {
    params.set("sort", sort);
  }

  const response = await fetch(
    `${API_URL}/marketplace/products?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result: ProductsResponse =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Failed to fetch marketplace products."
    );
  }

  return result;
};

export const getMarketplaceProduct = async (
  productId: string
): Promise<MarketplaceProduct> => {
  const API_URL = getApiUrl();

  const response = await fetch(
    `${API_URL}/marketplace/products/${productId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result: ProductResponse =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Failed to fetch product."
    );
  }

  return result.data;
};

export const createMarketplaceProduct = async (
  payload: CreateProductPayload
) => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/marketplace/products`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Failed to create product."
    );
  }

  return result;
};

export const getMyListings = async (
  _sellerEmail?: string
): Promise<MarketplaceProduct[]> => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/marketplace/my-listings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result: ProductsResponse =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Failed to fetch your listings."
    );
  }

  return result.data || [];
};

export const updateMarketplaceProduct = async (
  productId: string,
  sellerEmailOrPayload: string | Partial<MarketplaceProduct>,
  maybePayload?: Partial<MarketplaceProduct>
) => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();
  const payload =
    typeof sellerEmailOrPayload === "string"
      ? maybePayload || {}
      : sellerEmailOrPayload;

  const response = await fetch(
    `${API_URL}/marketplace/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Failed to update product."
    );
  }

  return result;
};

export const deleteMarketplaceProduct = async (
  productId: string,
  _sellerEmail?: string
) => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/marketplace/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
        "Failed to delete product."
    );
  }

  return result;
};

interface CreatePurchaseRequestPayload {
  productId: string;
  quantity: number;
  deliveryLocation: string;
  note?: string;
}

export const createPurchaseRequest = async (
  payload: CreatePurchaseRequestPayload
): Promise<PurchaseRequestResponse> => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/purchase-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const result: PurchaseRequestResponse =
    await response.json();

  if (
    !response.ok ||
    !result.success
  ) {
    throw new Error(
      result.message ||
        "Failed to send purchase request."
    );
  }

  return result;
};

export const getSentPurchaseRequests =
  async (): Promise<PurchaseRequestsResponse> => {
    const API_URL = getApiUrl();
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/purchase-requests/sent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result: PurchaseRequestsResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to fetch sent requests."
      );
    }

    return result;
  };

export const getReceivedPurchaseRequests =
  async (): Promise<PurchaseRequestsResponse> => {
    const API_URL = getApiUrl();
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/purchase-requests/received`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result: PurchaseRequestsResponse =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to fetch received requests."
      );
    }

    return result;
  };

export const updatePurchaseRequestStatus =
  async (
    requestId: string,
    status: PurchaseRequestStatus
  ) => {
    const API_URL = getApiUrl();
    const token = await getAuthToken();

    const response = await fetch(
      `${API_URL}/purchase-requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ||
          "Failed to update request status."
      );
    }

    return result;
  };
