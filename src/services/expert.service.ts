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
      const response = await fetch(`${API_URL}/experts/me`, {
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
  } catch (err) {
    console.error("Failed to load expert profile from server:", err);
  }

  // Load user from session if server profile not reachable
  const sessionUser = await authClient.getSession().catch(() => null);
  const user = sessionUser?.data?.user;

  return {
    _id: user?.id || "",
    id: user?.id || "",
    name: user?.name || "Expert",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    avatar: (user as any)?.avatar || (user as any)?.image || "/images/default-avatar.png",
    title: (user as any)?.title || "Agricultural Expert",
    specialization: (user as any)?.specialization
      ? Array.isArray((user as any).specialization)
        ? (user as any).specialization
        : [(user as any).specialization]
      : ["General Agriculture"],
    bio: (user as any)?.bio || "",
    experienceYears: (user as any)?.experienceYears || 0,
    qualification: (user as any)?.qualification || "",
    institution: (user as any)?.institution || "",
    rating: 5.0,
    ratingCount: 0,
    totalConsultations: 0,
    consultationFee:
      typeof (user as any)?.consultationFee === "number"
        ? (user as any).consultationFee
        : 500,
    languages: ["Bengali", "English"],
    location: "",
    isVerified: true,
  };
};

export const updateExpertProfile = async (
  payload: Partial<ExpertProfile>
): Promise<ExpertProfile> => {
  const API_URL = getApiUrl();
  const token = await getAuthToken();
  if (token) {
    const response = await fetch(`${API_URL}/experts/me`, {
      method: "PATCH",
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
    } else {
      const errJson = await response.json().catch(() => null);
      if (errJson?.message) {
        throw new Error(errJson.message);
      }
    }
  }
  throw new Error("Failed to update expert profile on server");
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

export const getAvailability = getExpertAvailability;
export const updateAvailability = updateExpertAvailability;

export const getAllExperts = async (): Promise<ExpertProfile[]> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/experts`, {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch experts from server:", err);
  }

  return [];
};

export const getExpertById = async (expertId: string): Promise<ExpertProfile | null> => {
  const all = await getAllExperts();
  const found = all.find((e) => (e._id || e.id) === expertId);
  return found || null;
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

