import {
  authClient,
} from "@/lib/auth-client";

/* ============================================================
   API CONFIG
============================================================ */

const LOCAL_API_URL =
  "http://localhost:5000/api/v1";

const getApiUrl =
  () => {
    const configuredUrl =
      process.env
        .NEXT_PUBLIC_API_URL
        ?.trim();

    if (
      configuredUrl
    ) {
      return configuredUrl.replace(
        /\/+$/,
        ""
      );
    }

    /*
     * Keep localhost available during local development,
     * but never silently use it in a production build.
     */
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      throw new Error(
        "AgriNova API is not configured. Set NEXT_PUBLIC_API_URL."
      );
    }

    return LOCAL_API_URL;
  };

/* ============================================================
   TYPES
============================================================ */

export type SupplyRequestStatus =
  | "SUBMITTED"
  | "ACCEPTED"
  | "REJECTED"
  | "RECEIVED"
  | "COMPLETED";

export interface CreateSupplyRequestPayload {
  farmerName:
    string;

  phone:
    string;

  farmerEmail?:
    string;

  productName:
    string;

  category:
    string;

  quantity:
    number;

  unit:
    string;

  expectedPrice:
    number;

  division:
    string;

  district:
    string;

  upazila:
    string;

  location:
    string;

  branch:
    string;

  notes?:
    string;

  images?:
    string[];
}

export interface SupplyRequest
  extends CreateSupplyRequestPayload {
  _id:
    string;

  trackingCode:
    string;

  farmerId?:
    string;

  status:
    SupplyRequestStatus;

  adminNote?:
    string;

  acceptedAt?:
    string;

  rejectedAt?:
    string;

  receivedAt?:
    string;

  completedAt?:
    string;

  createdAt:
    string;

  updatedAt:
    string;
}

export interface SupplyRequestMeta {
  page:
    number;

  limit:
    number;

  total:
    number;

  totalPages:
    number;
}

export type SupplyRequestStats =
  Record<
    SupplyRequestStatus,
    number
  >;

export interface ApiResponse<T> {
  success:
    boolean;

  message?:
    string;

  data:
    T;

  meta?:
    SupplyRequestMeta;
}

/* ============================================================
   AUTH HELPERS
============================================================ */

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

      const token =
        String(
          data.token
        ).trim();

      if (
        !token
      ) {
        throw new Error(
          "Authentication required."
        );
      }

      return token;
    } catch {
      throw new Error(
        "Authentication required. Please sign in again."
      );
    }
  };

const requireAccessToken =
  (
    token:
      string
  ) => {
    const normalized =
      String(
        token ||
          ""
      ).trim();

    if (
      !normalized
    ) {
      throw new Error(
        "Authentication required."
      );
    }

    return normalized;
  };

/* ============================================================
   RESPONSE HELPER
============================================================ */

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

/* ============================================================
   FARMER - CREATE REQUEST
============================================================ */

export const createSupplyRequest =
  async (
    payload:
      CreateSupplyRequestPayload
  ) => {
    const token =
      await getFarmerAccessToken();

    const response =
      await fetch(
        `${getApiUrl()}/supply-chain/requests`,
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

/* ============================================================
   FARMER - MY REQUESTS
============================================================ */

export const getMySupplyRequests =
  async ({
    page = 1,
    limit = 20,
    status,
  }: {
    page?:
      number;

    limit?:
      number;

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
        Math.max(
          page,
          1
        )
      )
    );

    params.set(
      "limit",
      String(
        Math.max(
          limit,
          1
        )
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
        `${getApiUrl()}/supply-chain/requests/mine?${params.toString()}`,
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

/* ============================================================
   FARMER - TRACK OWN REQUEST
============================================================ */

export const trackSupplyRequest =
  async (
    trackingCode:
      string
  ) => {
    const token =
      await getFarmerAccessToken();

    const normalized =
      String(
        trackingCode ||
          ""
      )
        .trim()
        .toUpperCase();

    if (
      !normalized
    ) {
      throw new Error(
        "Tracking ID is required."
      );
    }

    /*
     * Current production tracking format:
     * AGN-XXXXXXXX
     *
     * Keep this synchronized with the server and
     * SubmissionStatusFlow.tsx.
     */
    if (
      !/^AGN-[A-F0-9]{8}$/.test(
        normalized
      )
    ) {
      throw new Error(
        "Enter a valid tracking ID in the format AGN-XXXXXXXX."
      );
    }

    const response =
      await fetch(
        `${getApiUrl()}/supply-chain/requests/track/${encodeURIComponent(
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

/* ============================================================
   ADMIN - GET REQUESTS
============================================================ */

export const getAdminSupplyRequests =
  async (
    token:
      string,

    options?: {
      page?:
        number;

      limit?:
        number;

      status?:
        SupplyRequestStatus;

      branch?:
        string;

      search?:
        string;
    }
  ) => {
    const accessToken =
      requireAccessToken(
        token
      );

    const params =
      new URLSearchParams();

    if (
      options?.page
    ) {
      params.set(
        "page",
        String(
          Math.max(
            options.page,
            1
          )
        )
      );
    }

    if (
      options?.limit
    ) {
      params.set(
        "limit",
        String(
          Math.max(
            options.limit,
            1
          )
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
        ?.trim()
    ) {
      params.set(
        "branch",
        options.branch.trim()
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
        `${getApiUrl()}/supply-chain/requests${
          queryString
            ? `?${queryString}`
            : ""
        }`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
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

/* ============================================================
   ADMIN - REQUEST STATS
============================================================ */

export const getAdminSupplyRequestStats =
  async (
    token:
      string
  ): Promise<
    ApiResponse<SupplyRequestStats>
  > => {
    const accessToken =
      requireAccessToken(
        token
      );

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
              accessToken,
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

        /*
         * Preferred source: server pagination total.
         * Fallback keeps the UI usable if meta is absent.
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
    const normalizedId =
      String(
        requestId ||
          ""
      ).trim();

    if (
      !normalizedId
    ) {
      throw new Error(
        "Supply request ID is required."
      );
    }

    const accessToken =
      requireAccessToken(
        token
      );

    const response =
      await fetch(
        `${getApiUrl()}/supply-chain/requests/${encodeURIComponent(
          normalizedId
        )}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
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
    const normalizedId =
      String(
        requestId ||
          ""
      ).trim();

    if (
      !normalizedId
    ) {
      throw new Error(
        "Supply request ID is required."
      );
    }

    const accessToken =
      requireAccessToken(
        token
      );

    const response =
      await fetch(
        `${getApiUrl()}/supply-chain/requests/${encodeURIComponent(
          normalizedId
        )}/status`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${accessToken}`,
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
