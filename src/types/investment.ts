export type InvestmentCategory =
  | "organic_farming"
  | "poultry"
  | "vegetable_farming"
  | "greenhouse"
  | "irrigation"
  | "equipment"
  | "technology"
  | "livestock"
  | "fishery"
  | "other";

export type InvestmentStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type FundingStatus = "OPEN" | "FUNDED" | "CLOSED";
export type InvestmentApplicationStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type InvestmentPaymentMethod = "BANK_TRANSFER" | "STRIPE";
export type InvestmentPaymentStatus =
  | "NOT_STARTED"
  | "AWAITING_PAYMENT"
  | "PENDING_VERIFICATION"
  | "PAID"
  | "PAYMENT_REJECTED"
  | "FAILED";

export interface InvestmentProject {
  _id: string;
  projectCode: string;
  farmerId: string;
  farmerName?: string;
  farmerEmail?: string;
  farmId: string;
  farmName?: string;
  projectName: string;
  category: InvestmentCategory;
  requiredInvestment: number;
  minimumInvestment: number;
  fundedAmount: number;
  durationMonths: number;
  division: string;
  district: string;
  upazila: string;
  address?: string;
  description: string;
  useOfFunds: string;
  projectImage?: string;
  supportingDocument?: string;
  status: InvestmentStatus;
  fundingStatus: FundingStatus;
  adminNote?: string;
  reviewedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentProjectPayload {
  farmId: string;
  projectName: string;
  category: InvestmentCategory;
  requiredInvestment: number;
  minimumInvestment: number;
  durationMonths: number;
  description: string;
  useOfFunds: string;
  projectImage?: string;
  supportingDocument?: string;
}

export interface InvestmentApplication {
  _id: string;
  applicationCode: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  projectOwnerId: string;
  projectOwnerName?: string;
  projectOwnerEmail?: string;
  investorId: string;
  investorName?: string;
  investorEmail?: string;
  /** Admin API only. Farmer/investor responses intentionally omit this field. */
  nidNumber?: string;
  amount: number;
  note?: string;
  paymentMethod: InvestmentPaymentMethod;
  status: InvestmentApplicationStatus;
  adminNote?: string;
  reviewedAt?: string;
  paymentStatus: InvestmentPaymentStatus;
  senderBankName?: string;
  transactionReference?: string;
  paymentProofUrl?: string;
  stripeSessionId?: string;
  paymentAdminNote?: string;
  paymentReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentListResponse<T> {
  meta: { page: number; limit: number; total: number; totalPages: number };
  data: T[];
}

export interface CreateInvestmentApplicationPayload {
  amount: number;
  nidNumber: string;
  note?: string;
  paymentMethod: InvestmentPaymentMethod;
}