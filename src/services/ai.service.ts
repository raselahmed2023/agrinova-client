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

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
};

// Fallback Agronomic Treatment Presets for Bangladesh Agriculture
const FALLBACK_TREATMENTS: Record<string, TreatmentRecommendationResponse> = {
  fungal: {
    diagnosis:
      "Fungal Blight / Leaf Spot complex (likely Alternaria or Phytophthora infection). Severe foliar lesion formation observed with active necrotic centers, compromising photosynthetic canopy efficiency.",
    prescriptions: [
      "Mancozeb 75% WP @ 2.5g/L of water (Protective contact fungicide)",
      "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L of water (Systemic translaminar action)",
      "Agricultural non-ionic surfactant/sticker @ 0.5ml/L of water for optimal leaf adherence",
    ],
    treatmentSteps: [
      "Field Sanitation: Collect and dispose of heavily blighted lower leaves outside the boundary.",
      "Application: Spray uniformly early in the morning or late afternoon, ensuring complete under-leaf coverage.",
      "Irrigation Adjustment: Refrain from overhead sprinkling; irrigate through furrows to keep foliage dry.",
      "Crop Nutrition: Apply balanced potassium-rich foliar nutrients after 5 days to reinforce plant cell walls.",
    ],
    followUpDays: 7,
    followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    additionalNotes:
      "Safety: Wear protective gloves and face mask during application. Observe a 10-day pre-harvest interval (PHI). Avoid application if rain is imminent within 4 hours.",
    treatmentMode: "integrated",
  },
  pest: {
    diagnosis:
      "Lepidopteran borer or defoliating caterpillar infestation (e.g. Stem Borer / Fall Armyworm / Helicoverpa). Active larval feeding damage detected on vegetative tissue and leaf whorls.",
    prescriptions: [
      "Chlorantraniliprole 18.5% SC @ 0.4ml/L of water or Cartap Hydrochloride 50 SP @ 1.2g/L",
      "Neem seed kernel extract (NSKE 5%) or Azadirachtin 10,000 ppm @ 2ml/L (Bio-repellent)",
      "Spreader/activator @ 0.5ml/L of water",
    ],
    treatmentSteps: [
      "Scouting & Trapping: Install sex pheromone traps (4-5 per acre) and yellow sticky traps for vector monitoring.",
      "Direct Target Spraying: Direct spray specifically into the central whorls where young larvae shelter.",
      "Night Light Trapping: Place light traps over water basins at field borders to trap adult moths.",
      "Post-Spray Evaluation: Check larval mortality after 72 hours before considering any secondary spray.",
    ],
    followUpDays: 7,
    followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    additionalNotes:
      "Safety: Spray during calm wind conditions to avoid chemical drift. Wash equipment thoroughly after use. 14-day pre-harvest interval.",
    treatmentMode: "integrated",
  },
  bacterial: {
    diagnosis:
      "Bacterial Wilt / Leaf Blight caused by Ralstonia or Xanthomonas pathovars. Vascular occlusion causing rapid diurnal wilting and water-soaked leaf streaks.",
    prescriptions: [
      "Copper Hydroxide 77% WP or Copper Oxychloride 50% WP @ 2.5g/L of water",
      "Streptomycin Sulphate + Tetracycline Hydrochloride (9:1) @ 0.5g/L of water",
      "Pseudomonas fluorescens bio-agent @ 5g/L for soil drenching around root zones",
    ],
    treatmentSteps: [
      "Rogueing: Uproot severely wilted plants along with root-zone soil and incinerate outside the field.",
      "Drainage & Aeration: Create drainage channels immediately to prevent waterlogging and cross-contamination.",
      "Root Drenching: Drench surrounding healthy plant root zones with Copper Oxychloride solution.",
      "Crop Rotation: Avoid planting solanaceous crops in this specific patch for the upcoming 2 seasons.",
    ],
    followUpDays: 10,
    followUpDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    additionalNotes:
      "Sterilize all cutting tools in 10% bleach solution between rows to avoid mechanical transmission of bacteria.",
    treatmentMode: "integrated",
  },
  deficiency: {
    diagnosis:
      "Physiological Micronutrient Deficiency (interveinal chlorosis indicating Zinc, Boron, or Iron imbalance, compounded by soil pH lockout).",
    prescriptions: [
      "Chelated Zinc (Zn-EDTA 12%) @ 1.0g/L of water",
      "Solubor / Borax (Di-sodium Octaborate Tetrahydrate) @ 1.5g/L of water",
      "Water-soluble balanced NPK 19:19:19 foliar fertilizer @ 4.0g/L of water",
    ],
    treatmentSteps: [
      "Soil Conditioning: Apply decomposed farmyard manure or vermicompost to improve cation exchange capacity.",
      "Foliar Feeding: Apply micronutrient spray in the cool morning hours when stomata are open.",
      "Repeat Application: Administer a second light foliar booster after 10-12 days if new leaves still show pale venation.",
      "Moisture Maintenance: Maintain consistent soil moisture to enable active nutrient uptake.",
    ],
    followUpDays: 14,
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    additionalNotes:
      "Mix fertilizers thoroughly in a bucket of water before pouring into the sprayer tank. Do not mix with copper fungicides.",
    treatmentMode: "integrated",
  },
  organic: {
    diagnosis:
      "Organic Plant Health Restoration & Biological Pest/Fungus Suppression regimen. Enhancing systemic acquired resistance (SAR) in the crop.",
    prescriptions: [
      "Cold-pressed Neem Oil (10,000 ppm) @ 4ml/L with mild liquid soap (1ml/L) as emulsifier",
      "Trichoderma viride / harzianum bio-fungicide @ 5g/L for soil drenching & foliage",
      "Fermented Panchagavya or Jeevamrutha @ 30ml/L of water as organic bio-stimulant",
    ],
    treatmentSteps: [
      "Sanitation: Prune damaged foliage and deposit in an active compost pile.",
      "Bio-Drenching: Apply Trichoderma solution directly to wet soil around crop root systems.",
      "Foliar Emulsion Spray: Spray neem oil emulsion evenly over upper and lower leaf surfaces during late afternoon.",
      "Mulching: Apply dried straw or organic mulch around base to conserve beneficial soil microbes.",
    ],
    followUpDays: 10,
    followUpDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    additionalNotes:
      "Zero chemical residue; 100% eco-friendly and safe for pollinators. Harvest can safely proceed after 24-48 hours.",
    treatmentMode: "organic",
  },
};

export const getTreatmentRecommendationFromAI = async (
  payload: TreatmentRecommendationRequest
): Promise<TreatmentRecommendationResponse> => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/ai/treatment-recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn("Server AI request failed or unreachable, using agronomic knowledge engine fallback:", err);
  }

  // Fallback pattern matching on problem title & description
  const combined = `${payload.problemTitle} ${payload.problemDescription} ${payload.cropType}`.toLowerCase();
  let selected = FALLBACK_TREATMENTS.fungal;

  if (payload.treatmentMode === "organic") {
    selected = FALLBACK_TREATMENTS.organic;
  } else if (combined.includes("borer") || combined.includes("worm") || combined.includes("caterpillar") || combined.includes("pest") || combined.includes("larva") || combined.includes("insect")) {
    selected = FALLBACK_TREATMENTS.pest;
  } else if (combined.includes("wilt") || combined.includes("bacteri") || combined.includes("canker") || combined.includes("rot")) {
    selected = FALLBACK_TREATMENTS.bacterial;
  } else if (combined.includes("yellow") || combined.includes("deficien") || combined.includes("stunt") || combined.includes("zinc") || combined.includes("nutrient")) {
    selected = FALLBACK_TREATMENTS.deficiency;
  }

  // Personalize with crop and title
  return {
    ...selected,
    diagnosis: `${payload.cropType} Diagnostic Assessment: ${selected.diagnosis} Primary trigger: "${payload.problemTitle}".`,
    treatmentMode: payload.treatmentMode || "integrated",
    followUpDate: new Date(Date.now() + selected.followUpDays * 86400000).toISOString().split("T")[0],
  };
};

export const CLINICAL_PRESETS = [
  {
    id: "late_blight",
    title: "Fungal Blight & Leaf Spot",
    badge: "Fungicide Protocol",
    cropMatch: ["Potato", "Tomato", "Brinjal", "Chili"],
    data: FALLBACK_TREATMENTS.fungal,
  },
  {
    id: "stem_borer",
    title: "Stem Borer & Caterpillars",
    badge: "IPM Insecticide",
    cropMatch: ["Rice", "Maize", "Eggplant", "Cabbage"],
    data: FALLBACK_TREATMENTS.pest,
  },
  {
    id: "bacterial_wilt",
    title: "Bacterial Wilt & Canker",
    badge: "Bactericide Protocol",
    cropMatch: ["Tomato", "Potato", "Chili", "Banana"],
    data: FALLBACK_TREATMENTS.bacterial,
  },
  {
    id: "micronutrient",
    title: "Zinc, Boron & NPK Deficiency",
    badge: "Nutrient Foliar Spray",
    cropMatch: ["Rice", "Wheat", "Mustard", "Corn"],
    data: FALLBACK_TREATMENTS.deficiency,
  },
  {
    id: "organic_bio",
    title: "100% Organic & Bio-Control",
    badge: "Bio-Pesticide Regimen",
    cropMatch: ["Vegetables", "Fruits", "Herbs"],
    data: FALLBACK_TREATMENTS.organic,
  },
];
