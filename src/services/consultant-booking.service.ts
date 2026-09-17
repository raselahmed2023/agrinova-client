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
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      return null;
    }

    return data.token;
  } catch {
    return null;
  }
};

export const createConsultation = async (
  payload: CreateConsultationRequestPayload
): Promise<Consultation> => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();

  if (!token) {
    throw new Error(
      "You must be logged in as a farmer to save bookings to the database. Please log in first."
    );
  }

  if (!payload.expertId?.trim()) {
    throw new Error("A valid specialist is required before booking.");
  }

  /*
   * The backend is the source of truth for the consultation record,
   * assigned Expert details, status, Jitsi room ID and meeting link.
   * Do not manufacture room IDs or meeting links in the browser.
   */
  const response = await fetch(`${API_URL}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as
    | ConsultationResponse
    | { success?: boolean; message?: string }
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
    result && typeof result.message === "string"
      ? result.message
      : `Failed to save consultation to database (Status ${response.status}). Please try again.`;

  throw new Error(message);
};

export const bookExpertConsultation = createConsultation;
