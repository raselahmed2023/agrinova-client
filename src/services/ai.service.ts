import { authClient } from "@/lib/auth-client";

export interface TreatmentRecommendationRequest {
  cropType: string;
  problemTitle: string;
  problemDescription: string;
  urgency?: string;
  treatmentMode?: "integrated" | "organic" | "chemical";
  farmDetails?: string;
}

export interface TreatmentRecommendationResponse {
  diagnosis: string;
  prescriptions: string[];
  treatmentSteps: string[];
  followUpDays: number;
  followUpDate: string;
  additionalNotes: string;
  treatmentMode: string;
}

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const futureDate = (days: number) => new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

/*
 * These presets are deliberately non-prescriptive fallbacks.
 * Exact pesticide/antibiotic products, concentrations and doses should come
 * from the authenticated expert/AI workflow and must be checked against the
 * product label and local agricultural guidance before field use.
 */
const FALLBACK_TREATMENTS: Record<string, TreatmentRecommendationResponse> = {
  fungal: {
    diagnosis: "Symptoms may be consistent with a fungal leaf-spot or blight problem, but a remote description alone cannot confirm the pathogen.",
    prescriptions: [
      "Remove heavily affected plant material where practical and keep it away from healthy plants.",
      "Use only a locally registered crop-protection product that is labelled for the identified crop and disease, following the label exactly.",
      "Ask an agricultural expert to confirm the diagnosis before using a chemical treatment when symptoms are severe or spreading quickly.",
    ],
    treatmentSteps: [
      "Improve airflow and avoid keeping foliage wet for long periods.",
      "Inspect nearby plants and record whether symptoms are spreading.",
      "Sanitize tools between affected and healthy plants.",
      "Re-check the crop after several days and escalate to an expert if symptoms worsen.",
    ],
    followUpDays: 7,
    followUpDate: futureDate(7),
    additionalNotes: "Wear appropriate protective equipment and follow every label instruction, pre-harvest interval and local regulation for any crop-protection product.",
    treatmentMode: "integrated",
  },
  pest: {
    diagnosis: "The reported damage may be caused by an insect pest or feeding larvae. Confirm the pest before choosing a control method.",
    prescriptions: [
      "Use field scouting, traps and physical removal where practical as first-line monitoring/control measures.",
      "If treatment is needed, select only a locally registered product labelled for the crop and confirmed pest and follow the product label exactly.",
      "Use an agricultural expert for confirmation when infestation is widespread or identification is uncertain.",
    ],
    treatmentSteps: [
      "Inspect leaf undersides, stems, whorls and nearby plants for eggs, larvae or adults.",
      "Record pest counts and affected area before and after intervention.",
      "Protect beneficial insects by avoiding unnecessary broad-spectrum treatment.",
      "Reassess before repeating any treatment.",
    ],
    followUpDays: 7,
    followUpDate: futureDate(7),
    additionalNotes: "Do not mix or increase pesticide doses beyond the product label. Observe local safety and harvest-withholding requirements.",
    treatmentMode: "integrated",
  },
  bacterial: {
    diagnosis: "Symptoms may be compatible with a bacterial wilt/blight problem, but laboratory or expert confirmation may be needed because several stresses can look similar.",
    prescriptions: [
      "Isolate or remove severely affected plants when appropriate to reduce spread.",
      "Improve drainage and avoid moving contaminated soil or water between beds.",
      "Seek expert confirmation before applying bactericides or other antimicrobial products.",
    ],
    treatmentSteps: [
      "Sanitize cutting tools between plants.",
      "Avoid handling healthy plants immediately after affected plants.",
      "Check irrigation and drainage for routes that could spread infection.",
      "Consider crop rotation and resistant varieties for future cycles where relevant.",
    ],
    followUpDays: 7,
    followUpDate: futureDate(7),
    additionalNotes: "Do not use human/veterinary antibiotics on crops unless specifically registered and legally permitted for that agricultural use.",
    treatmentMode: "integrated",
  },
  deficiency: {
    diagnosis: "The symptoms may reflect nutrient deficiency, root stress or soil-pH-related nutrient lockout. A soil/leaf test is the safest way to distinguish these causes.",
    prescriptions: [
      "Check soil moisture, drainage and pH before adding nutrients.",
      "Use a soil or leaf nutrient test where available.",
      "Correct confirmed deficiencies using a crop-appropriate fertilizer according to its label or an agronomist's recommendation.",
    ],
    treatmentSteps: [
      "Compare symptoms on old versus new leaves and across the field.",
      "Review recent fertilizer applications and irrigation changes.",
      "Correct root-zone issues before applying additional fertilizer.",
      "Monitor new growth rather than expecting damaged leaves to recover completely.",
    ],
    followUpDays: 10,
    followUpDate: futureDate(10),
    additionalNotes: "Over-fertilization can injure crops and contaminate water. Base correction on diagnosis rather than symptom colour alone.",
    treatmentMode: "integrated",
  },
  organic: {
    diagnosis: "An integrated low-residue approach can begin with sanitation, monitoring and environmental correction while the exact problem is confirmed.",
    prescriptions: [
      "Prioritize sanitation, resistant varieties, crop rotation and physical/biological controls appropriate to the confirmed problem.",
      "If using an organic crop-protection product, confirm that it is registered for the crop and target and follow its label exactly.",
      "Escalate to an agricultural expert if the crop is deteriorating or identification remains uncertain.",
    ],
    treatmentSteps: [
      "Remove heavily damaged material where appropriate.",
      "Improve airflow, irrigation practice and field hygiene.",
      "Monitor pest/disease pressure with regular scouting.",
      "Document changes so follow-up recommendations can be based on evidence.",
    ],
    followUpDays: 7,
    followUpDate: futureDate(7),
    additionalNotes: "'Organic' does not automatically mean risk-free. Follow product labels, protective-equipment instructions and local agricultural rules.",
    treatmentMode: "organic",
  },
};

export const getTreatmentRecommendationFromAI = async (
  payload: TreatmentRecommendationRequest
): Promise<TreatmentRecommendationResponse> => {
  try {
    const { data: tokenData } = await authClient.token();
    if (!tokenData?.token) throw new Error("Authentication required");

    const response = await fetch(`${getApiUrl()}/ai/treatment-recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.data) {
      throw new Error(data?.message || "AI treatment recommendation failed");
    }
    return data.data;
  } catch (err) {
    console.warn("Authenticated treatment AI unavailable; using non-prescriptive safety fallback:", err);
  }

  const combined = `${payload.problemTitle} ${payload.problemDescription} ${payload.cropType}`.toLowerCase();
  let selected = FALLBACK_TREATMENTS.fungal;
  if (payload.treatmentMode === "organic") selected = FALLBACK_TREATMENTS.organic;
  else if (/borer|worm|caterpillar|pest|larva|insect/.test(combined)) selected = FALLBACK_TREATMENTS.pest;
  else if (/wilt|bacteri|canker|water.?soaked/.test(combined)) selected = FALLBACK_TREATMENTS.bacterial;
  else if (/yellow|deficien|stunt|zinc|nutrient|chlorosis/.test(combined)) selected = FALLBACK_TREATMENTS.deficiency;

  return {
    ...selected,
    diagnosis: `${payload.cropType}: ${selected.diagnosis} Reported issue: “${payload.problemTitle}”.`,
    treatmentMode: payload.treatmentMode || selected.treatmentMode,
    followUpDate: futureDate(selected.followUpDays),
  };
};

export const CLINICAL_PRESETS = [
  { id: "late_blight", title: "Fungal Blight & Leaf Spot", badge: "Integrated guidance", cropMatch: ["Potato", "Tomato", "Brinjal", "Chili"], data: FALLBACK_TREATMENTS.fungal },
  { id: "stem_borer", title: "Stem Borer & Caterpillars", badge: "IPM guidance", cropMatch: ["Rice", "Maize", "Eggplant", "Cabbage"], data: FALLBACK_TREATMENTS.pest },
  { id: "bacterial_wilt", title: "Bacterial Wilt & Canker", badge: "Disease hygiene", cropMatch: ["Tomato", "Potato", "Chili", "Banana"], data: FALLBACK_TREATMENTS.bacterial },
  { id: "micronutrient", title: "Possible Nutrient Deficiency", badge: "Test before treating", cropMatch: ["Rice", "Wheat", "Mustard", "Corn"], data: FALLBACK_TREATMENTS.deficiency },
  { id: "organic_bio", title: "Organic / Biological Approach", badge: "Low-residue guidance", cropMatch: ["Vegetables", "Fruits", "Herbs"], data: FALLBACK_TREATMENTS.organic },
];