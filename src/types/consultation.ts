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
  farmerName?: string;
  farmerEmail?: string;
  farmer: FarmerInfo;
  farmId?: string;
  farmName?: string;
  district?: string;
  expertId?: string;
  expertName?: string;
  expertEmail?: string;
  expert?: ExpertInfo;
  cropName?: string;
  cropType: string;
  problemTitle: string;
  problemDescription: string;
  images?: string[];
  status: ConsultationStatus;
  urgency?: ConsultationUrgency;
  scheduledAt?: string | Date;
  videoRoomId?: string;
  recommendation?: string;
  preferredDate?: string;
  preferredTime?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  notes?: string;
  recommendations?: RecommendationData;
  requestedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
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
  diagnosis?: string;
  recommendation?: string;
  prescriptions?: string[];
  treatmentSteps?: string[];
  followUpDate?: string;
  additionalNotes?: string;
}

export interface ScheduleConsultationPayload {
  consultationId: string;
  scheduledAt?: string | Date;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  notes?: string;
}

export interface CreateConsultationRequestPayload {
  cropType: string;
  cropName?: string;
  problemTitle: string;
  problemDescription: string;
  farmId?: string;
  farmName?: string;
  district?: string;
  images?: string[];
  urgency?: ConsultationUrgency;
  expertId?: string;
  expertName?: string;
  expertEmail?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  preferredDate?: string;
  preferredTime?: string;
  meetingLink?: string;
  notes?: string;
  farmerName?: string;
  farmerEmail?: string;
  farmerPhone?: string;
}

