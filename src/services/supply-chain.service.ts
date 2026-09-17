import {
  authClient,
} from "@/lib/auth-client";

const API_URL =
  (
    process.env
      .NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1"
  ).replace(
    /\/$/,
    ""
  );



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

  farmerId?: string;

  status:
    SupplyRequestStatus;

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

export interface ApiResponse<T> {
  success: boolean;

  message?: string;

  data: T;

  meta?:
    SupplyRequestMeta;
}


const getFarmerAccessToken =
  async () => {
    try {
      const {
        data,
        error,
      } =
        await authClient.token();

      if (
        error ||
        !data?.token
      ) {
        throw new Error(
          "Authentication required."
        );
      }

      return data.token;
    } catch (
      error
    ) {
      console.error(
        "Unable to retrieve supply-chain token:",
        error
      );

      throw new Error(
        "Authentication required. Please sign in again."
      );
    }
  };



const parseResponse =
  async <T>(
    response:
      Response
  ): Promise<
    ApiResponse<T>
  > => {
    let result:
      ApiResponse<T> | null =
      null;

    try {
      result =
        await response.json();
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    if (
      !response.ok ||
      !result?.success
    ) {
      throw new Error(
        result?.message ||
          `Request failed with status ${response.status}.`
      );
    }

    return result;
  };



export const createSupplyRequest =
  async (
    payload:
      CreateSupplyRequestPayload
  ) => {
    const token =
      await getFarmerAccessToken();

    const response =
      await fetch(
        `${API_URL}/supply-chain/requests`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",

          body:
            JSON.stringify(
              payload
            ),
        }
      );

    return parseResponse<
      SupplyRequest
    >(
      response
    );
  };



export const getMySupplyRequests =
  async ({
    page = 1,
    limit = 20,
    status,
  }: {
    page?: number;

    limit?: number;

    status?:
      SupplyRequestStatus;
  } = {}) => {
    const token =
      await getFarmerAccessToken();

    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(
        page
      )
    );

    params.set(
      "limit",
      String(
        limit
      )
    );

    if (
      status
    ) {
      params.set(
        "status",
        status
      );
    }

    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/mine?${params.toString()}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequest[]
    >(
      response
    );
  };



export const trackSupplyRequest =
  async (
    trackingCode:
      string
  ) => {
    const token =
      await getFarmerAccessToken();

    const normalized =
      trackingCode
        .trim()
        .toUpperCase();

    if (
      !normalized
    ) {
      throw new Error(
        "Tracking ID is required."
      );
    }

    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/track/${encodeURIComponent(
          normalized
        )}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequest
    >(
      response
    );
  };



export const getAdminSupplyRequests =
  async (
    token:
      string,

    options?: {
      page?: number;

      limit?: number;

      status?:
        SupplyRequestStatus;

      branch?: string;

      search?: string;
    }
  ) => {
    const params =
      new URLSearchParams();

    if (
      options?.page
    ) {
      params.set(
        "page",
        String(
          options.page
        )
      );
    }

    if (
      options?.limit
    ) {
      params.set(
        "limit",
        String(
          options.limit
        )
      );
    }

    if (
      options?.status
    ) {
      params.set(
        "status",
        options.status
      );
    }

    if (
      options?.branch
    ) {
      params.set(
        "branch",
        options.branch
      );
    }

    if (
      options?.search
        ?.trim()
    ) {
      params.set(
        "search",
        options.search.trim()
      );
    }

    const queryString =
      params.toString();

    const response =
      await fetch(
        `${API_URL}/supply-chain/requests${
          queryString
            ? `?${queryString}`
            : ""
        }`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequest[]
    >(
      response
    );
  };


export const getAdminSupplyRequestStats =
  async (
    token:
      string
  ): Promise<
    ApiResponse<SupplyRequestStats>
  > => {
    const statuses:
      SupplyRequestStatus[] =
      [
        "SUBMITTED",
        "ACCEPTED",
        "REJECTED",
        "RECEIVED",
        "COMPLETED",
      ];

    const results =
      await Promise.all(
        statuses.map(
          (
            status
          ) =>
            getAdminSupplyRequests(
              token,
              {
                page:
                  1,

                limit:
                  1,

                status,
              }
            )
        )
      );

    const stats:
      SupplyRequestStats =
      {
        SUBMITTED:
          0,

        ACCEPTED:
          0,

        REJECTED:
          0,

        RECEIVED:
          0,

        COMPLETED:
          0,
      };

    statuses.forEach(
      (
        status,
        index
      ) => {
        const response =
          results[
            index
          ];

        /**
         * Preferred:
         *
         * server pagination total
         */
        if (
          typeof response
            .meta
            ?.total ===
          "number"
        ) {
          stats[
            status
          ] =
            response.meta
              .total;

          return;
        }

        /**
         * Safe fallback.
         */
        stats[
          status
        ] =
          Array.isArray(
            response.data
          )
            ? response.data
                .length
            : 0;
      }
    );

    return {
      success:
        true,

      message:
        "Supply request statistics loaded successfully",

      data:
        stats,
    };
  };

/* ============================================================
   ADMIN - GET ONE REQUEST
============================================================ */

export const getSupplyRequestById =
  async (
    requestId:
      string,

    token:
      string
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/${encodeURIComponent(
          requestId
        )}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",
        }
      );

    return parseResponse<
      SupplyRequest
    >(
      response
    );
  };

/* ============================================================
   ADMIN - UPDATE STATUS
============================================================ */

export const updateSupplyRequestStatus =
  async (
    requestId:
      string,

    status:
      SupplyRequestStatus,

    token:
      string,

    adminNote?:
      string
  ) => {
    const response =
      await fetch(
        `${API_URL}/supply-chain/requests/${encodeURIComponent(
          requestId
        )}/status`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          credentials:
            "include",

          cache:
            "no-store",

          body:
            JSON.stringify(
              {
                status,

                ...(adminNote
                  ?.trim()
                  ? {
                      adminNote:
                        adminNote.trim(),
                    }
                  : {}),
              }
            ),
        }
      );

    return parseResponse<
      SupplyRequest
    >(
      response
    );
  };