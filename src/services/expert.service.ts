import { authClient } from "@/lib/auth-client";

import type {
  ExpertAvailability,
  ExpertAvailabilityResponse,
  ExpertDashboardData,
  ExpertDashboardResponse,
  ExpertProfile,
  ExpertProfileResponse,
  IAvailabilitySlot,
} from "@/types/expert";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

/* =========================================================
   HELPERS
========================================================= */

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function numberValue(
  value: unknown,
  fallback = 0
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed =
      Number(value);

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return fallback;
}

function stringArray(
  value: unknown
): string[] {
  if (
    Array.isArray(value)
  ) {
    return value
      .filter(
        (
          item
        ): item is string =>
          typeof item ===
          "string"
      )
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }

  if (
    typeof value ===
    "string"
  ) {
    return value
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }

  return [];
}

/* =========================================================
   EXPERT NORMALIZER
========================================================= */

function normalizeExpert(
  value: unknown
): ExpertProfile {
  const raw: Record<
    string,
    unknown
  > =
    isRecord(value)
      ? value
      : {};

  const id =
    stringValue(
      raw._id
    ) ||
    stringValue(
      raw.id
    );

  const avatar =
    stringValue(
      raw.avatar
    ) ||
    stringValue(
      raw.image
    );

  const availabilityStatus =
    stringValue(
      raw.availabilityStatus
    ).toUpperCase();

  return {
    _id:
      id ||
      undefined,

    id:
      id ||
      undefined,

    userId:
      stringValue(
        raw.userId
      ) ||
      undefined,

    name:
      stringValue(
        raw.name,
        "Expert"
      ),

    email:
      stringValue(
        raw.email
      ),

    phone:
      stringValue(
        raw.phone
      ),

    avatar:
      avatar ||
      undefined,

    image:
      stringValue(
        raw.image
      ) ||
      undefined,

    title:
      stringValue(
        raw.title,
        "Agricultural Expert"
      ),

    specialization:
      stringArray(
        raw.specialization
      ),

    bio:
      stringValue(
        raw.bio
      ),

    experienceYears:
      numberValue(
        raw.experienceYears
      ),

    qualification:
      stringValue(
        raw.qualification
      ),

    institution:
      stringValue(
        raw.institution
      ) ||
      undefined,

    rating:
      numberValue(
        raw.rating
      ),

    ratingCount:
      numberValue(
        raw.ratingCount
      ),

    totalConsultations:
      numberValue(
        raw.totalConsultations
      ),

    consultationFee:
      numberValue(
        raw.consultationFee
      ),

    languages:
      stringArray(
        raw.languages
      ),

    location:
      stringValue(
        raw.location
      ) ||
      undefined,

    isVerified:
      raw.isVerified ===
      true,

    availabilityStatus:
      availabilityStatus ===
        "AVAILABLE" ||
      availabilityStatus ===
        "UNAVAILABLE"
        ? availabilityStatus
        : undefined,

    availabilitySlots:
      Array.isArray(
        raw.availabilitySlots
      )
        ? (raw.availabilitySlots as IAvailabilitySlot[])
        : [],
  };
}

/* =========================================================
   AUTH TOKEN
========================================================= */

async function getAuthToken(): Promise<string> {
  const {
    data:
      session,
  } =
    await authClient.getSession();

  if (
    !session?.user
  ) {
    throw new Error(
      "Authentication required."
    );
  }

  const {
    data,
    error,
  } =
    await authClient.token();

  if (
    error ||
    !data?.token
  ) {
    throw new Error(
      error?.message ||
        "Unable to retrieve authentication token."
    );
  }

  return data.token;
}

/* =========================================================
   RESPONSE PARSER
========================================================= */

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const result =
    await response
      .json()
      .catch(
        () =>
          null
      );

  if (
    !response.ok
  ) {
    const message =
      isRecord(result) &&
      typeof result.message ===
        "string"
        ? result.message
        : `Request failed with status ${response.status}.`;

    throw new Error(
      message
    );
  }

  if (
    !isRecord(result) ||
    result.success !==
      true
  ) {
    const message =
      isRecord(result) &&
      typeof result.message ===
        "string"
        ? result.message
        : "Invalid server response.";

    throw new Error(
      message
    );
  }

  return result as T;
}

/* =========================================================
   GET EXPERT PROFILE
========================================================= */

export async function getExpertProfile(): Promise<ExpertProfile> {
  const token =
    await getAuthToken();

  const response =
    await fetch(
      `${API_URL}/experts/me`,
      {
        method:
          "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache:
          "no-store",
      }
    );

  const result =
    await parseResponse<ExpertProfileResponse>(
      response
    );

  return normalizeExpert(
    result.data
  );
}

/* =========================================================
   UPDATE EXPERT PROFILE
========================================================= */

export async function updateExpertProfile(
  payload:
    Partial<ExpertProfile>
): Promise<ExpertProfile> {
  const token =
    await getAuthToken();

  const response =
    await fetch(
      `${API_URL}/experts/me`,
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(
            payload
          ),

        cache:
          "no-store",
      }
    );

  const result =
    await parseResponse<ExpertProfileResponse>(
      response
    );

  return normalizeExpert(
    result.data
  );
}

/* =========================================================
   GET EXPERT AVAILABILITY
========================================================= */

export async function getExpertAvailability(): Promise<ExpertAvailability> {
  const token =
    await getAuthToken();

  const response =
    await fetch(
      `${API_URL}/experts/me/availability`,
      {
        method:
          "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache:
          "no-store",
      }
    );

  const result =
    await parseResponse<ExpertAvailabilityResponse>(
      response
    );

  return result.data;
}

/* =========================================================
   UPDATE EXPERT AVAILABILITY
========================================================= */

export async function updateExpertAvailability(
  payload: {
    availabilityStatus:
      | "AVAILABLE"
      | "UNAVAILABLE";

    availabilitySlots:
      IAvailabilitySlot[];
  }
): Promise<ExpertAvailability> {
  const token =
    await getAuthToken();

  const response =
    await fetch(
      `${API_URL}/experts/me/availability`,
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body:
          JSON.stringify(
            payload
          ),

        cache:
          "no-store",
      }
    );

  const result =
    await parseResponse<ExpertAvailabilityResponse>(
      response
    );

  return result.data;
}

/* =========================================================
   ALIASES
========================================================= */

export const getAvailability =
  getExpertAvailability;

export const updateAvailability =
  updateExpertAvailability;

/* =========================================================
   PUBLIC EXPERT LIST
========================================================= */

export async function getAllExperts(): Promise<
  ExpertProfile[]
> {
  try {
    const response =
      await fetch(
        `${API_URL}/experts`,
        {
          method:
            "GET",

          cache:
            "no-store",
        }
      );

    const result =
      await response
        .json()
        .catch(
          () =>
            null
        );

    if (
      !response.ok ||
      !isRecord(result) ||
      result.success !==
        true ||
      !Array.isArray(
        result.data
      )
    ) {
      return [];
    }

    return result.data.map(
      (
        expert
      ) =>
        normalizeExpert(
          expert
        )
    );
  } catch (
    error
  ) {
    console.error(
      "Unable to load experts:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET EXPERT BY ID
========================================================= */

export async function getExpertById(
  expertId: string
): Promise<
  ExpertProfile | null
> {
  const experts =
    await getAllExperts();

  return (
    experts.find(
      (
        expert
      ) =>
        expert._id ===
          expertId ||
        expert.id ===
          expertId
    ) ||
    null
  );
}

/* =========================================================
   EXPERT DASHBOARD
========================================================= */

export async function getExpertDashboard(): Promise<
  ExpertDashboardData | null
> {
  try {
    const token =
      await getAuthToken();

    const response =
      await fetch(
        `${API_URL}/experts/me/dashboard`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          cache:
            "no-store",
        }
      );

    const result =
      await parseResponse<ExpertDashboardResponse>(
        response
      );

    return result.data;
  } catch (
    error
  ) {
    console.error(
      "Unable to load expert dashboard:",
      error
    );

    return null;
  }
}