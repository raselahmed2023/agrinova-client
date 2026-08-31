import { authClient } from "@/lib/auth-client";
import type {
  Consultation,
  ConsultationResponse,
  ConsultationsResponse,
  ConsultationStatus,
  ConsultationStats,
  CreateRecommendationPayload,
  ScheduleConsultationPayload,
} from "@/types/consultation";

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

// Initial mock data matching user requirements & examples
let mockConsultations: Consultation[] = [
  {
    _id: "cons-101",
    farmerId: "farm-001",
    farmer: {
      name: "Rahim",
      email: "rahim.farmer@example.com",
      phone: "+880 1711-234567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      location: "Bogra, Rajshahi",
      farmType: "Paddy & Vegetable Farm",
      farmSize: "3.5 Acres",
    },
    cropType: "Rice",
    problemTitle: "Rice leaf disease",
    problemDescription:
      "Yellowish brown spots appearing on the leaves of aman rice seedlings. The tips are turning dry and brittle over the past 4 days. Need urgent advice on pesticide or fungicide.",
    images: [
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=80",
    ],
    status: "PENDING",
    urgency: "HIGH",
    preferredDate: "2026-09-01",
    preferredTime: "10:00 AM",
    createdAt: "2026-08-31T09:15:00Z",
  },
  {
    _id: "cons-102",
    farmerId: "farm-002",
    farmer: {
      name: "Karim",
      email: "karim.uddin@example.com",
      phone: "+880 1819-876543",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      location: "Jessore, Khulna",
      farmType: "Horticulture & Vegetables",
      farmSize: "2.0 Acres",
    },
    cropType: "Tomato & Eggplant",
    problemTitle: "Irrigation issue",
    problemDescription:
      "Drip irrigation emitters clogged with mineral deposits causing uneven moisture distribution in block B. Plants showing early signs of water stress and blossom end rot.",
    images: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6ef23996?w=600&auto=format&fit=crop&q=80",
    ],
    status: "SCHEDULED",
    urgency: "MEDIUM",
    scheduledDate: "31 Aug 2026",
    scheduledTime: "07:30 PM",
    meetingLink: "https://meet.agrinova.io/room/cons-102",
    notes: "Review water filtration setup and recommend mild acid flushing.",
    createdAt: "2026-08-30T14:20:00Z",
  },
  {
    _id: "cons-103",
    farmerId: "farm-003",
    farmer: {
      name: "Hasan",
      email: "hasan.ali@example.com",
      phone: "+880 1912-345678",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      location: "Mymensingh",
      farmType: "Cereal Crops",
      farmSize: "5.0 Acres",
    },
    cropType: "Maize / Corn",
    problemTitle: "Pest attack",
    problemDescription:
      "Fall armyworm caterpillar infestation discovered in the central whorl of maize crops. Leaves showing typical window-pane damage and ragged holes.",
    images: [
      "https://images.unsplash.com/photo-1536147116438-62679a5e01f2?w=600&auto=format&fit=crop&q=80",
    ],
    status: "ONGOING",
    urgency: "EMERGENCY",
    scheduledDate: "31 Aug 2026",
    scheduledTime: "02:15 PM",
    meetingLink: "https://meet.agrinova.io/room/cons-103",
    notes: "Live consultation currently in session. Examining leaf underside specimens.",
    createdAt: "2026-08-31T08:00:00Z",
  },
  {
    _id: "cons-104",
    farmerId: "farm-004",
    farmer: {
      name: "Abdul Mazid",
      email: "mazid.farm@example.com",
      phone: "+880 1611-998877",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      location: "Rangpur",
      farmType: "Potato Farm",
      farmSize: "8.0 Acres",
    },
    cropType: "Potato",
    problemTitle: "Late blight prevention",
    problemDescription:
      "Foggy weather expected over next week. Seeking preventive fungicide schedule and dosage for late blight control.",
    status: "ACCEPTED",
    urgency: "HIGH",
    preferredDate: "2026-09-01",
    preferredTime: "03:00 PM",
    notes: "Accepted by expert. Awaiting schedule confirmation.",
    createdAt: "2026-08-31T11:45:00Z",
  },
  {
    _id: "cons-105",
    farmerId: "farm-005",
    farmer: {
      name: "Tariqul Islam",
      email: "tariqul.islam@example.com",
      phone: "+880 1515-443322",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      location: "Comilla",
      farmType: "Fruit Orchard",
      farmSize: "4.2 Acres",
    },
    cropType: "Guava & Mango",
    problemTitle: "Fruit fly management in orchard",
    problemDescription:
      "Guava fruits getting stung by oriental fruit flies before ripening, leading to premature drop and rotting.",
    images: [
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80",
    ],
    status: "COMPLETED",
    urgency: "LOW",
    scheduledDate: "30 Aug 2026",
    scheduledTime: "11:00 AM",
    meetingLink: "https://meet.agrinova.io/room/cons-105",
    recommendations: {
      diagnosis: "Bactrocera dorsalis (Oriental fruit fly) oviposition damage.",
      prescriptions: [
        "Pheromone lure traps (Methyl Eugenol) @ 5 traps per bigha",
        "Protein bait spray (Spinosad 0.024% CB) on orchard borders weekly",
        "Biodegradable fruit bagging 25 days before expected harvest",
      ],
      treatmentSteps: [
        "1. Install traps at canopy height away from direct sunlight.",
        "2. Collect and bury all fallen infested fruits at least 2 feet deep.",
        "3. Apply bait spray spot applications in early mornings.",
      ],
      followUpDate: "2026-09-15",
      additionalNotes: "Avoid broad-spectrum chemical sprays to protect native beneficial pollinators.",
      createdAt: "2026-08-30T12:00:00Z",
    },
    createdAt: "2026-08-29T10:00:00Z",
  },
  {
    _id: "cons-106",
    farmerId: "farm-006",
    farmer: {
      name: "Nazrul Islam",
      email: "nazrul.farm@example.com",
      phone: "+880 1712-887766",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      location: "Dinajpur",
      farmType: "Litchi & Wheat",
      farmSize: "6.0 Acres",
    },
    cropType: "Litchi",
    problemTitle: "Nutrient deficiency symptoms",
    problemDescription:
      "Interveinal chlorosis on new foliage. Soil test pH is 7.4. Need advice on micronutrient foliar blend.",
    status: "PENDING",
    urgency: "MEDIUM",
    createdAt: "2026-08-31T12:30:00Z",
  },
];

export const getExpertStats = async (): Promise<ConsultationStats> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/consultations/expert/stats`, {
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
    // Fall back to local calculation
  }

  return {
    newRequests: mockConsultations.filter((c) => c.status === "PENDING").length,
    accepted: mockConsultations.filter((c) => c.status === "ACCEPTED").length,
    scheduled: mockConsultations.filter((c) => c.status === "SCHEDULED").length,
    ongoing: mockConsultations.filter((c) => c.status === "ONGOING").length,
    completed: mockConsultations.filter((c) => c.status === "COMPLETED").length,
    cancelled: mockConsultations.filter((c) => c.status === "CANCELLED").length,
    total: mockConsultations.length,
  };
};

export const getConsultations = async (params?: {
  status?: ConsultationStatus | "ALL";
  search?: string;
  limit?: number;
}): Promise<Consultation[]> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.limit) query.set("limit", String(params.limit));

    if (token) {
      const response = await fetch(`${API_URL}/consultations/expert?${query.toString()}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result: ConsultationsResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }

  let list = [...mockConsultations];
  if (params?.status && params.status !== "ALL") {
    list = list.filter((c) => c.status === params.status);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.farmer.name.toLowerCase().includes(s) ||
        c.problemTitle.toLowerCase().includes(s) ||
        c.cropType.toLowerCase().includes(s)
    );
  }
  if (params?.limit) {
    list = list.slice(0, params.limit);
  }
  return list;
};

export const getConsultationById = async (
  consultationId: string
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(`${API_URL}/consultations/${consultationId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock
  }

  const found = mockConsultations.find(
    (c) => c._id === consultationId || c.id === consultationId
  );
  if (!found) {
    // Return first mock with replaced id if not found, to ensure demo flow never breaks
    return {
      ...mockConsultations[0],
      _id: consultationId,
    };
  }
  return found;
};

export const acceptConsultationRequest = async (
  consultationId: string
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(
        `${API_URL}/consultations/${consultationId}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock update
  }

  mockConsultations = mockConsultations.map((c) =>
    c._id === consultationId || c.id === consultationId
      ? { ...c, status: "ACCEPTED" as ConsultationStatus, updatedAt: new Date().toISOString() }
      : c
  );
  return getConsultationById(consultationId);
};

export const rejectConsultationRequest = async (
  consultationId: string,
  reason?: string
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(
        `${API_URL}/consultations/${consultationId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock update
  }

  mockConsultations = mockConsultations.map((c) =>
    c._id === consultationId || c.id === consultationId
      ? {
          ...c,
          status: "REJECTED" as ConsultationStatus,
          rejectionReason: reason || "Unavailable at this time",
          updatedAt: new Date().toISOString(),
        }
      : c
  );
  return getConsultationById(consultationId);
};

export const scheduleConsultation = async (
  payload: ScheduleConsultationPayload
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(
        `${API_URL}/consultations/${payload.consultationId}/schedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock update
  }

  const generatedLink =
    payload.meetingLink ||
    `https://meet.agrinova.io/room/${payload.consultationId}`;

  mockConsultations = mockConsultations.map((c) =>
    c._id === payload.consultationId || c.id === payload.consultationId
      ? {
          ...c,
          status: "SCHEDULED" as ConsultationStatus,
          scheduledDate: payload.scheduledDate,
          scheduledTime: payload.scheduledTime,
          meetingLink: generatedLink,
          notes: payload.notes || c.notes,
          updatedAt: new Date().toISOString(),
        }
      : c
  );
  return getConsultationById(payload.consultationId);
};

export const updateConsultationStatus = async (
  consultationId: string,
  status: ConsultationStatus
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(
        `${API_URL}/consultations/${consultationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock update
  }

  mockConsultations = mockConsultations.map((c) =>
    c._id === consultationId || c.id === consultationId
      ? { ...c, status, updatedAt: new Date().toISOString() }
      : c
  );
  return getConsultationById(consultationId);
};

export const submitRecommendation = async (
  payload: CreateRecommendationPayload
): Promise<Consultation> => {
  try {
    const API_URL = getApiUrl();
    const token = await getAuthToken();
    if (token) {
      const response = await fetch(
        `${API_URL}/consultations/${payload.consultationId}/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const result: ConsultationResponse = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    }
  } catch {
    // Fall back to mock update
  }

  mockConsultations = mockConsultations.map((c) =>
    c._id === payload.consultationId || c.id === payload.consultationId
      ? {
          ...c,
          status: "COMPLETED" as ConsultationStatus,
          recommendations: {
            diagnosis: payload.diagnosis,
            prescriptions: payload.prescriptions,
            treatmentSteps: payload.treatmentSteps,
            followUpDate: payload.followUpDate,
            additionalNotes: payload.additionalNotes,
            createdAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        }
      : c
  );
  return getConsultationById(payload.consultationId);
};
