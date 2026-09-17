import { apiRequest } from "@/services/api.client";
import type {
  Consultation,
  ConsultationStatus,
  ConsultationStats,
  ConsultationUrgency,
  CreateConsultationRequestPayload,
  CreateRecommendationPayload,
  ScheduleConsultationPayload,
} from "@/types/consultation";

export interface GetConsultationsParams {
  status?: ConsultationStatus | "ALL";
  search?: string;
  cropType?: string;
  limit?: number;
  page?: number;
  isExpert?: boolean;
}

function buildQuery(params?: GetConsultationsParams): string {
  const query = new URLSearchParams();

  if (params?.status && params.status !== "ALL") {
    query.set("status", params.status);
  }

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.cropType?.trim()) {
    query.set("cropType", params.cropType.trim());
  }

  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  if (params?.page) {
    query.set("page", String(params.page));
  }

  return query.toString();
}

export const getExpertStats = async (): Promise<ConsultationStats> => {
  return apiRequest<ConsultationStats>("/consultations/expert/stats");
};

export const getConsultations = async (
  params?: GetConsultationsParams
): Promise<Consultation[]> => {
  const endpoint = params?.isExpert
    ? "/consultations/expert"
    : "/consultations";

  return apiRequest<Consultation[]>(
    endpoint,
    "GET",
    undefined,
    buildQuery(params)
  );
};

export const getConsultationById = async (
  consultationId: string
): Promise<Consultation> => {
  if (!consultationId?.trim()) {
    throw new Error("Consultation id is required.");
  }

  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}`
  );
};

export const acceptConsultationRequest = async (
  consultationId: string
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/accept`,
    "PATCH",
    {}
  );
};

export const rejectConsultationRequest = async (
  consultationId: string,
  reason?: string
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/reject`,
    "PATCH",
    { reason }
  );
};

export const acceptConsultation = acceptConsultationRequest;
export const rejectConsultation = rejectConsultationRequest;

export const scheduleConsultation = async (
  payload: ScheduleConsultationPayload
): Promise<Consultation> => {
  const { consultationId, ...body } = payload;

  if (!consultationId?.trim()) {
    throw new Error("Consultation id is required.");
  }

  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/schedule`,
    "PATCH",
    body
  );
};

export const startVideoConsultation = async (
  consultationId: string
): Promise<{
  status: ConsultationStatus;
  videoRoomId: string;
  meetingLink: string;
}> => {
  return apiRequest<{
    status: ConsultationStatus;
    videoRoomId: string;
    meetingLink: string;
  }>(
    `/consultations/${encodeURIComponent(consultationId)}/start`,
    "PATCH",
    {}
  );
};

export const updateConsultationStatus = async (
  consultationId: string,
  status: ConsultationStatus,
  reason?: string
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/status`,
    "PATCH",
    { status, reason }
  );
};

export const completeConsultation = async (
  consultationId: string
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/complete`,
    "PATCH",
    {}
  );
};

export const submitRecommendation = async (
  payload: CreateRecommendationPayload
): Promise<Consultation> => {
  const { consultationId, ...body } = payload;

  if (!consultationId?.trim()) {
    throw new Error("Consultation id is required.");
  }

  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/recommendation`,
    "PATCH",
    body
  );
};

export const getExpertConsultations = async (
  params?: Omit<GetConsultationsParams, "isExpert">
): Promise<Consultation[]> => {
  return getConsultations({
    ...params,
    isExpert: true,
  });
};

export const getExpertRequests = async (
  params?: {
    limit?: number;
    page?: number;
    search?: string;
  }
): Promise<Consultation[]> => {
  return getConsultations({
    ...params,
    status: "PENDING",
    isExpert: true,
  });
};

export const createConsultation = async (
  payload: CreateConsultationRequestPayload
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    "/consultations",
    "POST",
    payload
  );
};

export const startConsultation = startVideoConsultation;
export const saveRecommendation = submitRecommendation;

export const updateConsultationDetails = async (
  consultationId: string,
  payload: {
    cropType?: string;
    cropName?: string;
    problemTitle?: string;
    problemDescription?: string;
    urgency?: ConsultationUrgency;
    farmName?: string;
    district?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    scheduledAt?: string | Date;
    meetingLink?: string;
    notes?: string;
  }
): Promise<Consultation> => {
  return apiRequest<Consultation>(
    `/consultations/${encodeURIComponent(consultationId)}/details`,
    "PATCH",
    payload
  );
};

export const rescheduleConsultation = async (
  consultationId: string,
  scheduledDate: string,
  scheduledTime: string,
  notes?: string
): Promise<Consultation> => {
  return updateConsultationDetails(consultationId, {
    scheduledDate,
    scheduledTime,
    notes,
  });
};

export const deleteConsultation = async (
  consultationId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const result = await apiRequest<{
    id?: string;
    message?: string;
  }>(
    `/consultations/${encodeURIComponent(consultationId)}`,
    "DELETE"
  );

  return {
    success: true,
    message: result?.message || "Consultation deleted successfully",
  };
};
