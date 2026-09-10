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
  } catch (err: any) {
    if (err?.message && !err.message.includes("fetch")) {
      throw err;
    }
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

export const getAvailability = getExpertAvailability;
export const updateAvailability = updateExpertAvailability;

export const mockExpertsList: ExpertProfile[] = [
  {
    _id: "exp-001",
    id: "exp-001",
    name: "Dr. Rafiqul Islam",
    email: "dr.rafiqul@agrinova.io",
    phone: "+880 1712-345678",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    title: "Senior Agronomist & Plant Pathologist",
    institution: "Bangladesh Agricultural University (BAU)",
    specialization: [
      "Plant Pathology",
      "Fungal Diagnostics",
      "Crop Protection",
      "Rice & Cereal Diseases",
    ],
    bio: "Over 14 years of research and field advisory experience in cereal and horticulture crops across Bangladesh. Specializing in sustainable crop protection and fungal diagnostics.",
    experienceYears: 14,
    qualification: "Ph.D. in Plant Pathology (BAU), M.Sc. in Agriculture",
    rating: 4.9,
    ratingCount: 128,
    totalConsultations: 342,
    consultationFee: 500,
    languages: ["Bengali", "English"],
    location: "Mymensingh / Dhaka",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "SATURDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
      { day: "SUNDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
      { day: "TUESDAY", enabled: true, startTime: "17:00", endTime: "20:00" },
      { day: "THURSDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
    ],
  },
  {
    _id: "exp-002",
    id: "exp-002",
    name: "Dr. Farhana Yasmin",
    email: "dr.farhana@agrinova.io",
    phone: "+880 1722-987654",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    title: "Chief Soil Scientist & Nutritionist",
    institution: "Bangladesh Agricultural Research Institute (BARI)",
    specialization: [
      "Soil Fertility & pH",
      "Micronutrient Deficiency",
      "Organic Composting",
      "Salinity Management",
    ],
    bio: "Pioneering soil rehabilitation in the coastal and northern regions of Bangladesh. Expert in correcting zinc/boron deficiencies and balancing organic NPK fertilizers.",
    experienceYears: 11,
    qualification: "Ph.D. in Soil Science (BARI/DAE)",
    rating: 4.95,
    ratingCount: 94,
    totalConsultations: 215,
    consultationFee: 450,
    languages: ["Bengali", "English"],
    location: "Gazipur / Jessore",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "SUNDAY", enabled: true, startTime: "15:00", endTime: "18:30" },
      { day: "MONDAY", enabled: true, startTime: "16:00", endTime: "19:00" },
      { day: "WEDNESDAY", enabled: true, startTime: "15:00", endTime: "18:30" },
      { day: "SATURDAY", enabled: true, startTime: "14:00", endTime: "17:00" },
    ],
  },
  {
    _id: "exp-003",
    id: "exp-003",
    name: "Eng. Tanvir Ahmed",
    email: "eng.tanvir@agrinova.io",
    phone: "+880 1811-445566",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    title: "Precision Irrigation & Climate Specialist",
    institution: "AgriNova Smart Farming Labs / BUET",
    specialization: [
      "Drip & Sprinkler Systems",
      "IoT Soil Moisture Sensors",
      "Greenhouse Climate",
      "Water Conservation",
    ],
    bio: "Helping farmers optimize water usage by up to 40% with precision drip lines, automation valves, and solar pump integration.",
    experienceYears: 9,
    qualification: "M.Sc. in Agricultural Engineering",
    rating: 4.88,
    ratingCount: 76,
    totalConsultations: 180,
    consultationFee: 400,
    languages: ["Bengali", "English"],
    location: "Bogra / Rajshahi",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "SATURDAY", enabled: true, startTime: "19:00", endTime: "22:00" },
      { day: "TUESDAY", enabled: true, startTime: "19:00", endTime: "22:00" },
      { day: "THURSDAY", enabled: true, startTime: "19:00", endTime: "22:00" },
      { day: "FRIDAY", enabled: true, startTime: "16:00", endTime: "19:00" },
    ],
  },
  {
    _id: "exp-004",
    id: "exp-004",
    name: "Dr. Selim Jahangir",
    email: "dr.selim@agrinova.io",
    phone: "+880 1913-778899",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    title: "Horticulture & Fruit Orchard Consultant",
    institution: "Horticulture Research Centre (HRC), Rajshahi",
    specialization: [
      "Mango & Guava Management",
      "Fruit Fly Control (Bactrocera)",
      "Canopy Pruning",
      "Post-Harvest Handling",
    ],
    bio: "Advisory consultant for commercial fruit orchards across Chapainawabganj and Rajshahi. Expert in organic fruit bagging, pruning, and fruit fly control.",
    experienceYears: 16,
    qualification: "Ph.D. in Pomology & Horticulture",
    rating: 4.92,
    ratingCount: 112,
    totalConsultations: 290,
    consultationFee: 500,
    languages: ["Bengali", "English"],
    location: "Rajshahi / Chapainawabganj",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "MONDAY", enabled: true, startTime: "16:00", endTime: "19:30" },
      { day: "WEDNESDAY", enabled: true, startTime: "16:00", endTime: "19:30" },
      { day: "FRIDAY", enabled: true, startTime: "15:00", endTime: "18:00" },
      { day: "SUNDAY", enabled: true, startTime: "17:00", endTime: "20:00" },
    ],
  },
  {
    _id: "exp-005",
    id: "exp-005",
    name: "Prof. Nazmul Huda",
    email: "prof.nazmul@agrinova.io",
    phone: "+880 1512-334455",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    title: "Entomologist & Bio-Pesticide Researcher",
    institution: "Sher-e-Bangla Agricultural University (SAU)",
    specialization: [
      "Fall Armyworm Control",
      "Stem Borer & Planthopper",
      "Biological Pest Control",
      "Pheromone Trapping",
    ],
    bio: "Specializing in emergency pest infestation management, minimal-chemical integrated pest control, and protecting beneficial pollinators.",
    experienceYears: 18,
    qualification: "Professor of Entomology, Ph.D.",
    rating: 4.89,
    ratingCount: 88,
    totalConsultations: 310,
    consultationFee: 600,
    languages: ["Bengali", "English"],
    location: "Dhaka / Comilla",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "SATURDAY", enabled: true, startTime: "17:30", endTime: "20:30" },
      { day: "MONDAY", enabled: true, startTime: "18:00", endTime: "21:00" },
      { day: "THURSDAY", enabled: true, startTime: "17:30", endTime: "20:30" },
    ],
  },
  {
    _id: "exp-006",
    id: "exp-006",
    name: "Dr. Shamsun Nahar",
    email: "dr.shamsun@agrinova.io",
    phone: "+880 1614-223344",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    title: "Seed Science & Vegetable Specialist",
    institution: "Bangladesh Rice Research Institute (BRRI)",
    specialization: [
      "Hybrid Seed Vigor",
      "Vegetable Nursery Health",
      "Late Blight in Potato",
      "Hydroponic Greenery",
    ],
    bio: "Helping commercial vegetable and seedling growers diagnose early damping off, fungal wilts, and seed dormancy issues.",
    experienceYears: 13,
    qualification: "Ph.D. in Agronomy & Seed Pathology",
    rating: 4.96,
    ratingCount: 140,
    totalConsultations: 260,
    consultationFee: 350,
    languages: ["Bengali", "English"],
    location: "Rangpur / Dinajpur",
    isVerified: true,
    availabilityStatus: "AVAILABLE",
    availabilitySlots: [
      { day: "SUNDAY", enabled: true, startTime: "16:30", endTime: "19:30" },
      { day: "TUESDAY", enabled: true, startTime: "16:30", endTime: "19:30" },
      { day: "THURSDAY", enabled: true, startTime: "16:30", endTime: "19:30" },
      { day: "SATURDAY", enabled: true, startTime: "10:00", endTime: "13:00" },
    ],
  },
];

export const getAllExperts = async (): Promise<ExpertProfile[]> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/experts`, {
      method: "GET",
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch experts from server, using fallback:", err);
  }

  return mockExpertsList;
};

export const getExpertById = async (expertId: string): Promise<ExpertProfile | null> => {
  const all = await getAllExperts();
  const found = all.find((e) => (e._id || e.id) === expertId);
  return found || mockExpertsList[0];
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

