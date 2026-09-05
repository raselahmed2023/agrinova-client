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
  status: SupplyRequestStatus;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

const parseResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Something went wrong."
    );
  }

  return result;
};

export const createSupplyRequest = async (
  payload: CreateSupplyRequestPayload
) => {
  const response = await fetch(
    `${API_URL}/supply-chain/requests`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse<SupplyRequest>(
    response
  );
};

export const getAdminSupplyRequests =
  async (token: string) => {
    const response = await fetch(
      `${API_URL}/supply-chain/requests`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    return parseResponse<
      SupplyRequest[]
    >(response);
  };

export const updateSupplyRequestStatus =
  async (
    requestId: string,
    status: SupplyRequestStatus,
    token: string
  ) => {
    const response = await fetch(
      `${API_URL}/supply-chain/requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    return parseResponse<SupplyRequest>(
      response
    );
  };