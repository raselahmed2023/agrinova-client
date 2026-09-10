import { authClient } from "@/lib/auth-client";
import type {
  Consultation,
  ConsultationResponse,
  CreateConsultationRequestPayload,
} from "@/types/consultation";

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
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
  const cleanId = `cons-${Date.now()}`;
  const videoRoomId = `agrinova-consultation-${cleanId}`;
  const meetingLink = payload.meetingLink || `https://meet.jit.si/${videoRoomId}`;

  const API_URL = getApiUrl();
  const token = await getAuthToken();

  if (!token) {
    throw new Error(
      "You must be logged in as a farmer to save bookings to the database. Please log in first."
    );
  }

  const response = await fetch(`${API_URL}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...payload,
      meetingLink,
    }),
  });

  if (response.ok) {
    const result: ConsultationResponse = await response.json();
    if (result.success && result.data) {
      return result.data;
    }
  }

  const errJson = await response.json().catch(() => null);
  const errMsg =
    errJson?.message ||
    `Failed to save consultation to database (Status ${response.status}). Please try again.`;
  throw new Error(errMsg);
};

export const bookExpertConsultation = createConsultation;
