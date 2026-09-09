import { apiRequest } from "./api.client";
import { IBlog, IBlogFormData, IBlogSingleResponse } from "@/types/blog";

const MOCK_FALLBACK_BLOGS: IBlog[] = [
  {
    _id: "blog-001",
    id: "blog-001",
    title: "Optimizing Soil Health: The Microbe-First Approach to High-Yield Farming",
    slug: "optimizing-soil-health-microbe-first-approach",
    category: "Soil Health",
    tags: ["Soil Biology", "Organic Matter", "Composting", "Regenerative"],
    summary:
      "Discover how cultivating active mycorrhizal fungi and beneficial soil bacteria can unlock bound nutrients, increase water retention, and reduce synthetic fertilizer dependency.",
    content: `Healthy soil is not merely an inert medium for roots; it is a teeming, dynamic biological ecosystem. When farmers prioritize living soil biology over chemical bombardment, crop vigor, drought tolerance, and nutrient density increase substantially.

### 1. The Living Rhizosphere
The root-soil interface, known as the rhizosphere, is where plant roots exchange photosynthetic sugars (exudates) for bioavailable minerals supplied by mycorrhizal fungi and nitrogen-fixing bacteria. When synthetic fertilizers are heavily broadcast, this natural trade system shuts down, leaving plants addicted to external inputs.

### 2. Practical Steps to Revive Degraded Soil
- **Minimize Destructive Tillage**: Heavy rototilling fractures fungal hyphae networks and oxidizes stored organic matter. Switch to strip-till or shallow vertical aeration.
- **Continuous Living Cover**: Plant cover crops like crimson clover, daikon radish, and hairy vetch between cash crop rotations to feed microbial life year-round.
- **Biological Inoculants & Humic Acids**: Introduce high-grade vermicompost and indigenous microorganism (IMO) tea to accelerate mineralization and improve soil aggregate structure.

### 3. Monitoring C:N Ratios for Optimal Composting
Balancing carbonaceous brown materials (straw, sawdust) with nitrogenous green materials (manure, legume tops) at an optimal 25:1 to 30:1 ratio stimulates rapid thermophilic decomposition without burning away vital nitrogen.

Investing in your soil structure today ensures consistent yield resilience against shifting climates for years to come.`,
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1000&auto=format&fit=crop&q=80",
    ],
    readTime: "5 min read",
    author: {
      id: "expert-soil-01",
      name: "Dr. Rafiqul Islam",
      email: "rafiqul.soil@agrinova.io",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      title: "Senior Agronomist & Soil Microbiologist",
      specialization: "Soil Health & Nutrient Management",
      bio: "Ph.D. in Soil Science with 14+ years advising South Asian smallholders on soil carbon sequestration and biological farming.",
    },
    status: "PUBLISHED",
    views: 342,
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    _id: "blog-002",
    id: "blog-002",
    title: "Smart Drip Irrigation: Cutting Water Waste by 40% While Boosting Harvests",
    slug: "smart-drip-irrigation-cutting-water-waste-boost-harvest",
    category: "Smart Irrigation",
    tags: ["Water Conservation", "Drip System", "Sensors", "Automation"],
    summary:
      "A practical blueprint for installing low-pressure drip fertigation lines equipped with capacitive soil moisture sensors to ensure uniform hydration without runoff.",
    content: `Water scarcity and erratic rainfall patterns pose a growing risk to modern agriculture. Conventional furrow and flood irrigation methods lose up to 50% of water through surface evaporation and deep percolation. Precision drip irrigation delivers metered water directly to the plant's active root zone.

### Why Pressure Compensation Matters
In undulating fields, standard micro-tubing causes uneven discharge, over-watering low elevation patches while starving upland plants. Pressure-compensating (PC) emitters guarantee equal delivery rates (1.6 to 2.4 L/hour) across runs of up to 100 meters.

### Key Components of an Affordable Drip Setup
1. **Primary Screen & Disc Filtration**: Essential to avoid silt and algae blockages in miniature emitter labyrinths.
2. **Venturi Injector for Fertigation**: Injects dissolved nutrients in synchrony with watering cycles, slashing fertilizer loss by 30%.
3. **Capacitive Moisture Probes**: Position sensors at 15cm and 45cm depths to identify when root zones drop below 60% field capacity.

### Maintenance Checklist
Flush mainline laterals every fortnight and run an organic acid rinse (such as dilute citric acid) at mid-season to dissolve mineral scale and bicarbonate deposits.`,
    images: [
      "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1000&auto=format&fit=crop&q=80",
    ],
    readTime: "4 min read",
    author: {
      id: "expert-irrig-02",
      name: "Engr. Shamim Hossain",
      email: "shamim.irrigation@agrinova.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      title: "Irrigation & Precision Ag Engineer",
      specialization: "Micro-Irrigation & Hydro-Tech",
      bio: "Specializing in solar-powered automated drip schemes and gravity-fed irrigation retrofits for vegetable growers.",
    },
    status: "PUBLISHED",
    views: 489,
    createdAt: "2026-08-25T11:30:00.000Z",
  },
  {
    _id: "blog-003",
    id: "blog-003",
    title: "Integrated Pest Management (IPM): Natural Defenses Against Rice Stem Borers",
    slug: "integrated-pest-management-rice-stem-borers",
    category: "Crop Protection",
    tags: ["IPM", "Pest Management", "Rice Farming", "Biological Control"],
    summary:
      "Eliminate devastating yellow stem borer infestations through pheromone trapping, trichogramma wasp parasitoids, and selective botanical repellents.",
    content: `Rice stem borers (*Scirpophaga incertulas*) are notorious for causing 'deadhearts' during tillering and 'whiteheads' during flowering stages. While prophylactic pesticide sprays kill beneficial predator insects and trigger pesticide resistance, Integrated Pest Management (IPM) suppresses borer populations ecologically.

### Step 1: Scouting & Pheromone Lures
Install delta or funnel pheromone traps at 8 traps per acre 10 days after transplanting. A sustained count exceeding 4 moths per trap per day indicates peak oviposition, signaling the exact window for biological intervention before larvae tunnel into the culm.

### Step 2: Inundative Release of Parasitoids
Introduce *Trichogramma japonicum* egg parasitoid cards at 20,000 parasitized eggs/acre weekly. These miniature beneficial wasps target and parasitize moth egg clusters before caterpillars hatch.

### Step 3: Botanical Sprays as Targeted Interventions
When larvae emerge, apply cold-pressed neem kernel oil (containing 3000 ppm azadirachtin) with an organic surfactant. Azadirachtin disrupts juvenile insect growth hormones without harming honeybees, spiders, or dragonfly nymphs.

By adopting multi-layered IPM, farm operating margins rise sharply due to decreased reliance on costly chemical canisters.`,
    images: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1000&auto=format&fit=crop&q=80",
    ],
    readTime: "6 min read",
    author: {
      id: "expert-ento-03",
      name: "Dr. Farhana Yasmin",
      email: "farhana.ipm@agrinova.io",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      title: "Senior Plant Pathologist & Entomologist",
      specialization: "Eco-Friendly Crop Protection",
      bio: "12 years field experience in South Asian paddy and horticulture disease diagnosis and bio-pesticide formulations.",
    },
    status: "PUBLISHED",
    views: 612,
    createdAt: "2026-08-30T09:15:00.000Z",
  },
  {
    _id: "blog-004",
    id: "blog-004",
    title: "Companion Planting Secrets: How Mustard & Legumes Protect Tomato Yields",
    slug: "companion-planting-secrets-mustard-legumes-tomatoes",
    category: "Organic Farming",
    tags: ["Companion Crops", "Tomatoes", "Biofumigation", "Organic"],
    summary:
      "Harness polyculture synergies: utilize brassica biofumigation to deter soil nematodes while intercropping bush beans to enrich available root nitrogen.",
    content: `Monocropping tomato plants frequently leaves them vulnerable to root-knot nematodes (*Meloidogyne spp.*) and early blight spores splash-transferred from bare soil. By interplanting complementary botanical allies, farmers construct natural defense perimeters.

### The Mustard Biofumigation Effect
Indian mustard (*Brassica juncea*) produces potent glucosinolates in its leaves and roots. When chopped and incorporated into the soil two weeks before tomato transplanting, the decaying tissue hydrolyzes into isothiocyanates—a natural compound that cleanses fungal pathogens and suppresses nematode egg viability.

### Synergistic Polyculture Layout
- **Perimeter Marigolds (*Tagetes patula*)**: Exude alpha-terthienyl from roots and draw hoverflies whose larvae feed on tomato aphids.
- **Interrow Dwarf French Beans**: Fix atmospheric nitrogen, feeding adjacent heavy-feeding tomato plants during peak vegetative growth.
- **Basil & Allium Borders**: Mask the volatile aroma of tomato foliage, confusing incoming whiteflies and thrips.

Transforming field perimeters into bio-diverse strips dramatically boosts fruit quality, lowers input bills, and fosters pollinator habitats.`,
    images: [
      "https://images.unsplash.com/photo-1592417817098-8f3d6ef23996?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536147116438-62679a5e01f2?w=1000&auto=format&fit=crop&q=80",
    ],
    readTime: "4 min read",
    author: {
      id: "expert-soil-01",
      name: "Dr. Rafiqul Islam",
      email: "rafiqul.soil@agrinova.io",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      title: "Senior Agronomist & Soil Microbiologist",
      specialization: "Soil Health & Nutrient Management",
      bio: "Ph.D. in Soil Science with 14+ years advising South Asian smallholders on soil carbon sequestration and biological farming.",
    },
    status: "PUBLISHED",
    views: 279,
    createdAt: "2026-09-02T14:40:00.000Z",
  },
  {
    _id: "blog-005",
    id: "blog-005",
    title: "Controlled Environment Agriculture: Scaling Commercial Hydroponics",
    slug: "controlled-environment-agriculture-scaling-hydroponics",
    category: "Modern Tech",
    tags: ["Hydroponics", "Vertical Farming", "Protected Ag", "AgriTech"],
    summary:
      "A complete operational guide to Nutrient Film Technique (NFT) and Dutch bucket systems for high-value lettuce, herbs, and bell peppers.",
    content: `Controlled Environment Agriculture (CEA) allows growers to produce crisp, pesticide-free greens 365 days a year with up to 90% less land and water. Here is how modern precision operations engineer reliable output.

### NFT vs. Bato Dutch Buckets
- **Nutrient Film Technique (NFT)**: Ideal for fast-turnaround shallow-root crops like butterhead lettuce, bok choy, and mint. A continuous 1mm thin film of oxygenated nutrient solution recirculates across sloping gulleys.
- **Dutch Buckets with Perlite**: Best suited for indeterminate vines like beefsteak tomatoes and seedless cucumbers. Intermittent drip cycles provide support without waterlogging heavy root systems.

### EC and pH Management
Maintaining an Electrical Conductivity (EC) of 1.6 to 2.2 mS/cm and solution pH between 5.8 and 6.2 ensures all micro-elements (Iron chelate, Manganese, Zinc, Boron) stay completely soluble for active uptake.`,
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1000&auto=format&fit=crop&q=80",
    ],
    readTime: "5 min read",
    author: {
      id: "expert-irrig-02",
      name: "Engr. Shamim Hossain",
      email: "shamim.irrigation@agrinova.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      title: "Irrigation & Precision Ag Engineer",
      specialization: "Micro-Irrigation & Hydro-Tech",
      bio: "Specializing in solar-powered automated drip schemes and gravity-fed irrigation retrofits for vegetable growers.",
    },
    status: "PUBLISHED",
    views: 410,
    createdAt: "2026-09-04T16:20:00.000Z",
  },
];

export async function getBlogs(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  authorId?: string;
  status?: string;
}): Promise<{ blogs: IBlog[]; meta?: { total: number; totalPages: number } }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category && params.category !== "All") searchParams.set("category", params.category);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.authorId) searchParams.set("authorId", params.authorId);
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    const res = await apiRequest<{
      success: boolean;
      data: IBlog[];
      meta?: { total: number; totalPages: number };
    }>("/blogs", "GET", undefined, query);

    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return { blogs: res.data, meta: res.meta };
    }
  } catch (error) {
    console.warn("API call to /blogs failed, using fallback blogs:", error);
  }

  // Filter fallback data
  let filtered = [...MOCK_FALLBACK_BLOGS];
  if (params?.category && params.category !== "All") {
    filtered = filtered.filter(
      (b) => b.category.toLowerCase() === params.category!.toLowerCase()
    );
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.summary.toLowerCase().includes(s) ||
        b.category.toLowerCase().includes(s) ||
        b.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  return {
    blogs: filtered,
    meta: { total: filtered.length, totalPages: 1 },
  };
}

export async function getBlogByIdOrSlug(idOrSlug: string): Promise<IBlogSingleResponse> {
  try {
    const res = await apiRequest<{
      success: boolean;
      data: IBlogSingleResponse;
    }>(`/blogs/${encodeURIComponent(idOrSlug)}`, "GET");

    if (res?.success && res.data?.blog) {
      return res.data;
    }
  } catch (error) {
    console.warn(`API call to /blogs/${idOrSlug} failed, using fallback:`, error);
  }

  const currentIndex = MOCK_FALLBACK_BLOGS.findIndex(
    (b) => b._id === idOrSlug || b.slug === idOrSlug || b.id === idOrSlug
  );

  const blog =
    currentIndex !== -1 ? MOCK_FALLBACK_BLOGS[currentIndex] : MOCK_FALLBACK_BLOGS[0];

  const nextIndex =
    currentIndex !== -1
      ? (currentIndex + 1) % MOCK_FALLBACK_BLOGS.length
      : 1;

  const prevIndex =
    currentIndex > 0
      ? currentIndex - 1
      : MOCK_FALLBACK_BLOGS.length - 1;

  return {
    blog,
    nextBlog: MOCK_FALLBACK_BLOGS[nextIndex] || null,
    prevBlog: MOCK_FALLBACK_BLOGS[prevIndex] || null,
  };
}

export async function createBlog(
  formData: IBlogFormData
): Promise<{ success: boolean; data?: IBlog; message?: string }> {
  try {
    const res = await apiRequest<{
      success: boolean;
      data: IBlog;
      message?: string;
    }>("/blogs", "POST", formData);
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to publish blog",
    };
  }
}

export async function updateBlog(
  id: string,
  formData: Partial<IBlogFormData>
): Promise<{ success: boolean; data?: IBlog; message?: string }> {
  try {
    const res = await apiRequest<{
      success: boolean;
      data: IBlog;
      message?: string;
    }>(`/blogs/${encodeURIComponent(id)}`, "PATCH", formData);
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update blog",
    };
  }
}

export async function deleteBlog(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await apiRequest<{
      success: boolean;
      message?: string;
    }>(`/blogs/${encodeURIComponent(id)}`, "DELETE");
    return res;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete blog",
    };
  }
}
