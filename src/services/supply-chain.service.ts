const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export type SupplyRequestStatus =
  | "SUBMITTED"
  | "ACCEPTED"
  | "REJECTED"
  | "RECEIVED"
  | "COMPLETED";

export interface CreateSupplyRequestPayload {
  farmerName: string;
  phone: string;
  farmerEmail?: string;

  productName: string;
  category: string;

  quantity: number;
  unit: string;

  expectedPrice: number;

  division: string;
  district: string;
  upazila: string;
  location: string;

  branch: string;

  notes?: string;

  images?: string[];
}

export interface SupplyRequest
  extends CreateSupplyRequestPayload {
  _id: string;

  trackingCode: string;

  status: SupplyRequestStatus;

  adminNote?: string;

  acceptedAt?: string;
  rejectedAt?: string;
  receivedAt?: string;
  completedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface SupplyRequestMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type SupplyRequestStats =
  Record<
    SupplyRequestStatus,
    number
  >;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: SupplyRequestMeta;
}

const parseResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const result =
    await response.json();

  if (
    !response.ok ||
    !result?.success
  ) {
    throw new Error(
      result?.message ||
        "Something went wrong."
    );
  }

  return result;
};

export const createSupplyRequest =
  async (
    payload:
      CreateSupplyRequestPayload
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      );

    return parseResponse<SupplyRequest>(
      response
    );
  };

export const trackSupplyRequest =
  async (
    trackingCode: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/track/${encodeURIComponent(
          trackingCode
            .trim()
            .toUpperCase()
        )}`,
        {
          method:
            "GET",

          cache:
            "no-store",
        }
      );

    return parseResponse<SupplyRequest>(
      response
    );
  };

export const getAdminSupplyRequests =
  async (
    token: string,

    options?: {
      page?: number;
      limit?: number;

      status?:
        SupplyRequestStatus;

      branch?: string;
      search?: string;
    }
  ) => {
    const query =
      new URLSearchParams();

    if (
      options?.page
    ) {
      query.set(
        "page",
        String(
          options.page
        )
      );
    }

    if (
      options?.limit
    ) {
      query.set(
        "limit",
        String(
          options.limit
        )
      );
    }

    if (
      options?.status
    ) {
      query.set(
        "status",
        options.status
      );
    }

    if (
      options?.branch
    ) {
      query.set(
        "branch",
        options.branch
      );
    }

    if (
      options?.search
        ?.trim()
    ) {
      query.set(
        "search",
        options.search.trim()
      );
    }

    const suffix =
      query.toString()
        ? `?${query.toString()}`
        : "";

    const response =
      await fetch(
        `${API_URL}/supply-chain/requests${suffix}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequest[]
    >(response);
  };

export const getAdminSupplyRequestStats =
  async (
    token: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/stats`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequestStats
    >(response);
  };

export const updateSupplyRequestStatus =
  async (
    requestId: string,

    status:
      SupplyRequestStatus,

    token: string,

    adminNote?: string
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/${requestId}/status`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              status,

              ...(adminNote?.trim()
                ? {
                    adminNote:
                      adminNote.trim(),
                  }
                : {}),
            }),
        }
      );

    return parseResponse<
      SupplyRequest
    >(response);
  };