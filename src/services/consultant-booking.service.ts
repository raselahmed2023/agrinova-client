import { authClient } from "@/lib/auth-client";

import type {
  Consultation,
  ConsultationResponse,
  CreateConsultationRequestPayload,
} from "@/types/consultation";


const getApiUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1"
  );
};


const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data, error } =
      await authClient.token();

    if (error || !data?.token) {
      return null;
    }

    return data.token;
  } catch {
    return null;
  }
};


export interface ConsultationStripeCheckoutResponse {
  sessionId: string;
  url: string | null;
}


export const createConsultationStripeCheckout =
  async (
    consultationId: string
  ): Promise<ConsultationStripeCheckoutResponse> => {

    const API_URL = getApiUrl();

    const token =
      await getAuthToken();

    if (!token) {
      throw new Error(
        "Please sign in before paying for a consultation."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/stripe/consultation-checkout`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          consultationId,
        }),

        cache: "no-store",
      }
    );

    const result =
      await response
        .json()
        .catch(() => null);

    if (
      response.ok &&
      result?.success &&
      result?.data
    ) {
      return result.data as ConsultationStripeCheckoutResponse;
    }

    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Unable to start Stripe checkout (Status ${response.status}).`
    );
  };


export const verifyConsultationStripeCheckout =
  async (
    sessionId: string
  ): Promise<Consultation> => {

    const API_URL =
      getApiUrl();

    const token =
      await getAuthToken();

    if (!token) {
      throw new Error(
        "Please sign in to verify your consultation payment."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/stripe/consultation-session/${encodeURIComponent(
        sessionId
      )}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

    const result =
      await response
        .json()
        .catch(() => null);

    if (
      response.ok &&
      result?.success &&
      result?.data?.consultation
    ) {
      return result.data
        .consultation as Consultation;
    }

    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Unable to verify Stripe payment (Status ${response.status}).`
    );
  };


export const cancelConsultationStripeCheckout =
  async (
    consultationId: string
  ): Promise<Consultation> => {

    const API_URL =
      getApiUrl();

    const token =
      await getAuthToken();

    if (!token) {
      throw new Error(
        "Please sign in to update this consultation."
      );
    }

    const response = await fetch(
      `${API_URL}/payments/stripe/consultation-cancel/${encodeURIComponent(
        consultationId
      )}`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

    const result =
      await response
        .json()
        .catch(() => null);

    if (
      response.ok &&
      result?.success &&
      result?.data
    ) {
      return result.data as Consultation;
    }

    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Unable to cancel consultation checkout (Status ${response.status}).`
    );
  };


export const createConsultation =
  async (
    payload: CreateConsultationRequestPayload
  ): Promise<Consultation> => {

    const API_URL =
      getApiUrl();

    const token =
      await getAuthToken();

    if (!token) {
      throw new Error(
        "You must be logged in as a farmer to save bookings to the database. Please log in first."
      );
    }

    if (!payload.expertId?.trim()) {
      throw new Error(
        "A valid specialist is required before booking."
      );
    }

    const response = await fetch(
      `${API_URL}/consultations`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(payload),

        cache:
          "no-store",
      }
    );

    const result =
      (await response
        .json()
        .catch(() => null)) as
        | ConsultationResponse
        | {
            success?: boolean;
            message?: string;
          }
        | null;

    if (
      response.ok &&
      result &&
      result.success === true &&
      "data" in result &&
      result.data
    ) {
      return result.data;
    }

    const message =
      result &&
      typeof result.message ===
        "string"
        ? result.message
        : `Failed to save consultation to database (Status ${response.status}). Please try again.`;

    throw new Error(message);
  };


export const bookExpertConsultation =
  createConsultation;