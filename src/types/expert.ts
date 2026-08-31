export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeSlot {
  id?: string;
  start: string; // "09:00"
  end: string;   // "12:00"
}

export interface DayAvailability {
  day: DayOfWeek;
  label: string;
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface ExpertAvailability {
  expertId?: string;
  isAcceptingConsultations: boolean;
  timezone: string;
  slotDurationMinutes: number;
  weeklySchedule: DayAvailability[];
  customDatesOff?: string[];
}

export interface ExpertProfile {
  _id?: string;
  id?: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  title: string;
  specialization: string[];
  bio: string;
  experienceYears: number;
  qualification: string;
  institution?: string;
  rating: number;
  ratingCount: number;
  totalConsultations: number;
  consultationFee: number;
  languages: string[];
  location?: string;
  isVerified?: boolean;
}

export interface ExpertStats {
  newRequests: number;
  accepted: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  totalEarnings?: number;
  averageRating?: number;
}

export interface ExpertProfileResponse {
  success: boolean;
  message?: string;
  data: ExpertProfile;
}

export interface ExpertAvailabilityResponse {
  success: boolean;
  message?: string;
  data: ExpertAvailability;
}

export interface ExpertDashboardData {
  newRequests: number;
  accepted: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  recentRequests: any[];
  upcomingConsultations: any[];
  ongoingConsultations: any[];
  availabilityStatus: string;
}

export interface ExpertDashboardResponse {
  success: boolean;
  message?: string;
  data: ExpertDashboardData;
}

