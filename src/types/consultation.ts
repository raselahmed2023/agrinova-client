export type ConsultationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type ConsultationUrgency = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export interface FarmerInfo {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  district?: string;
  farmName?: string;
  farmType?: string;
  farmSize?: string;
}

export interface ExpertInfo {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  title?: string;
  specialization?: string | string[];
}

export interface RecommendationData {
  diagnosis: string;
  prescriptions: string[];
  treatmentSteps: string[];
  followUpDate?: string;
  additionalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consultation {
  _id: string;
  id?: string;
  farmerId: string;
  farmer: FarmerInfo;
  farmName?: string;
  district?: string;
  expertId?: string;
  expert?: ExpertInfo;
  cropType: string;
  problemTitle: string;
  problemDescription: string;
  images?: string[];
  status: ConsultationStatus;
  urgency?: ConsultationUrgency;
  preferredDate?: string;
  preferredTime?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  notes?: string;
  recommendations?: RecommendationData;
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultationStats {
  newRequests: number;
  accepted: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  cancelled?: number;
  total?: number;
}

export interface ConsultationResponse {
  success: boolean;
  message?: string;
  data: Consultation;
}

export interface ConsultationsResponse {
  success: boolean;
  message?: string;
  data: Consultation[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateRecommendationPayload {
  consultationId: string;
  diagnosis: string;
  prescriptions: string[];
  treatmentSteps: string[];
  followUpDate?: string;
  additionalNotes?: string;
}

export interface ScheduleConsultationPayload {
  consultationId: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  notes?: string;
}
