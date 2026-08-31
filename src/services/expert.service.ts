import { authClient } from "@/lib/auth-client";
import type {
  ExpertAvailability,
  ExpertAvailabilityResponse,
  ExpertProfile,
  ExpertProfileResponse,
} from "@/types/expert";

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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

let mockProfile: ExpertProfile = {
  _id: "exp-001",
  id: "exp-001",
  name: "Dr. Rafiqul Islam",
  email: "dr.rafiqul@agrinova.io",
  phone: "+880 1712-345678",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  title: "Senior Agronomist & Plant Pathologist",
  specialization: [
    "Plant Pathology",
    "Crop Disease Management",
    "Pest Control (IPM)",
    "Soil Nutrition & Fertility",
    "Irrigation & Water Management",
  ],
  bio: "Over 14 years of research and field advisory experience in cereal and horticulture crops across Bangladesh. Specializing in sustainable crop protection, fungal diagnostics, and integrated pest management (IPM).",
  experienceYears: 14,
  qualification: "Ph.D. in Plant Pathology (BAU), M.Sc. in Agriculture",
  institution: "Bangladesh Agricultural University (BAU) / AgriNova Advisory Board",
  rating: 4.9,
  ratingCount: 128,
  totalConsultations: 342,
  consultationFee: 500,
  languages: ["Bengali", "English"],
  location: "Dhaka / Mymensingh, Bangladesh",
  isVerified: true,
};

let mockAvailability: ExpertAvailability = {
  expertId: "exp-001",
  isAcceptingConsultations: true,
  timezone: "Asia/Dhaka (GMT+6)",
  slotDurationMinutes: 30,
  weeklySchedule: [
    {
      day: "monday",
      label: "Monday",
      isAvailable: true,
      slots: [
        { id: "s1", start: "09:00", end: "12:00" },
        { id: "s2", start: "15:00", end: "18:00" },
      ],
    },
    {
      day: "tuesday",
      label: "Tuesday",
      isAvailable: true,
      slots: [
        { id: "s3", start: "10:00", end: "13:00" },
        { id: "s4", start: "16:00", end: "19:00" },
      ],
    },
    {
      day: "wednesday",
      label: "Wednesday",
      isAvailable: true,
      slots: [
        { id: "s5", start: "09:00", end: "12:00" },
        { id: "s6", start: "14:00", end: "17:00" },
      ],
    },
    {
      day: "thursday",
      label: "Thursday",
      isAvailable: true,
      slots: [{ id: "s7", start: "10:00", end: "14:00" }],
    },
    {
      day: "friday",
      label: "Friday",
      isAvailable: false,
      slots: [],
    },
    {
      day: "saturday",
      label: "Saturday",
      isAvailable: true,
      slots: [{ id: "s8", start: "15:00", end: "20:00" }],
    },
    {
      day: "sunday",
      label: "Sunday",
      isAvailable: true,
      slots: [
        { id: "s9", start: "09:00", end: "12:00" },
        { id: "s10", start: "14:00", end: "18:00" },
      ],
    },
  ],
  customDatesOff: ["2026-10-15", "2026-12-16"],
};

export const getExpertProfile = async (): Promise<ExpertProfile> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result: ExpertProfileResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }
  return mockProfile;
};

export const updateExpertProfile = async (
  payload: Partial<ExpertProfile>
): Promise<ExpertProfile> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result: ExpertProfileResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }

  mockProfile = {
    ...mockProfile,
    ...payload,
  };
  return mockProfile;
};

export const getExpertAvailability = async (): Promise<ExpertAvailability> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/availability`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result: ExpertAvailabilityResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }
  return mockAvailability;
};

export const updateExpertAvailability = async (
  payload: Partial<ExpertAvailability>
): Promise<ExpertAvailability> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result: ExpertAvailabilityResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }

  mockAvailability = {
    ...mockAvailability,
    ...payload,
  };
  return mockAvailability;
};
