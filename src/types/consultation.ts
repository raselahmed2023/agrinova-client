export type ConsultationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "MISSED";


export type ConsultationUrgency =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "EMERGENCY";


export type ConsultationPaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED";


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

  specialization?:
    | string
    | string[];
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


  // =========================
  // FARMER
  // =========================

  farmerId: string;

  farmerName?: string;
  farmerEmail?: string;

  farmer?: FarmerInfo;


  // =========================
  // FARM
  // =========================

  farmId?: string;

  farmName?: string;
  district?: string;


  // =========================
  // EXPERT
  // =========================

  expertId?: string;

  expertName?: string;
  expertEmail?: string;

  expert?: ExpertInfo;


  // =========================
  // CONSULTATION
  // =========================

  cropName?: string;

  cropType: string;

  problemTitle: string;

  problemDescription: string;

  images?: string[];


  // =========================
  // STATUS
  // =========================

  status: ConsultationStatus;

  urgency?: ConsultationUrgency;


  // =========================
  // SCHEDULE
  // =========================

  scheduledAt?: string | Date;

  preferredDate?: string;
  preferredTime?: string;

  scheduledDate?: string;
  scheduledTime?: string;


  // =========================
  // VIDEO
  // =========================

  videoRoomId?: string;

  meetingLink?: string;


  // =========================
  // STRIPE PAYMENT
  // =========================

  consultationFee?: number;

  paymentMethod?: "STRIPE";

  paymentStatus?: ConsultationPaymentStatus;

  stripeSessionId?: string;

  stripePaymentIntentId?: string;

  paidAt?: string | Date;


  // =========================
  // RESULT / NOTES
  // =========================

  recommendation?: string;

  rejectionReason?: string;

  cancellationReason?: string;

  notes?: string;

  recommendations?: RecommendationData;


  // =========================
  // DATES
  // =========================

  requestedAt?: string | Date;

  acceptedAt?: string | Date;

  startedAt?: string | Date;

  completedAt?: string | Date;

  createdAt: string | Date;

  updatedAt?: string | Date;
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