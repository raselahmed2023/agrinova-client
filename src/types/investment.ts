export type InvestmentCategory =
  | "organic_farming"
  | "poultry"
  | "vegetable_farming"
  | "greenhouse"
  | "irrigation"
  | "equipment"
  | "technology"
  | "other";

export type InvestmentStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface InvestmentProject {
  _id: string;
  projectCode: string;

  farmerId: string;
  farmerName?: string;

  projectName: string;
  category: InvestmentCategory;

  requiredInvestment: number;
  ownContribution: number;

  duration: string;
  expectedReturn: string;
  profitSharing: string;

  estimatedRevenue: number;
  estimatedCost: number;
  estimatedProfit: number;

  division: string;
  district: string;
  upazila: string;
  address: string;

  description: string;

  projectImage?: string;

  nidNumber?: string;
  nidFrontImage?: string;
  supportingDocument?: string;

  farmerEmail?: string;

  status: InvestmentStatus;

  adminNote?: string;

  reviewedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentProjectPayload {
  projectName: string;
  category: InvestmentCategory;

  requiredInvestment: number;
  ownContribution: number;

  duration: string;
  expectedReturn: string;
  profitSharing: string;

  estimatedRevenue: number;
  estimatedCost: number;
  estimatedProfit: number;

  division: string;
  district: string;
  upazila: string;
  address: string;

  description: string;

  projectImage?: string;

  nidNumber: string;
  nidFrontImage?: string;

  supportingDocument?: string;
}

export interface InvestmentListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: InvestmentProject[];
}