import { authClient } from "@/lib/auth-client";
import type {
  ExpertAvailability,
  ExpertAvailabilityResponse,
  ExpertProfile,
  ExpertProfileResponse,
  IAvailabilitySlot,
} from "@/types/expert";

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

let mockProfile: ExpertProfile = {
  _id: "exp-001",
  id: "exp-001",
  name: "Dr. Rafiqul Islam",
  email: "dr.rafiqul@agrinova.io",
  phone: "+880 1712-345678",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
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
  institution:
    "Bangladesh Agricultural University (BAU) / AgriNova Advisory Board",
  rating: 4.9,
  ratingCount: 128,
  totalConsultations: 342,
  consultationFee: 500,
  languages: ["Bengali", "English"],
  location: "Dhaka / Mymensingh, Bangladesh",
  isVerified: true,
  availabilityStatus: "AVAILABLE",
};

let mockAvailability: ExpertAvailability = {
  expertId: "exp-001",
  availabilityStatus: "AVAILABLE",
  availabilitySlots: [
    { day: "SATURDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
    { day: "SUNDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
    { day: "MONDAY", enabled: false, startTime: "18:00", endTime: "21:00" },
    { day: "TUESDAY", enabled: true, startTime: "17:00", endTime: "20:00" },
    { day: "WEDNESDAY", enabled: false, startTime: "18:00", endTime: "21:00" },
    { day: "THURSDAY", enabled: false, startTime: "18:00", endTime: "21:00" },
    { day: "FRIDAY", enabled: false, startTime: "18:00", endTime: "21:00" },
  ],
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
      const response = await fetch(`${API_URL}/experts/me/availability`, {
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
  payload: {
    availabilityStatus: "AVAILABLE" | "UNAVAILABLE";
    availabilitySlots: IAvailabilitySlot[];
  }
): Promise<ExpertAvailability> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/me/availability`, {
        method: "PATCH",
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
      } else {
        const errJson = await response.json().catch(() => null);
        if (errJson?.message) {
          throw new Error(errJson.message);
        }
      }
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes("fetch")) {
      throw err;
    }
  }

  mockAvailability = {
    ...mockAvailability,
    availabilityStatus: payload.availabilityStatus,
    availabilitySlots: payload.availabilitySlots,
  };
  return mockAvailability;
};

export const getExpertDashboard = async () => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/experts/me/dashboard`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back
  }
  return null;
};
