/* ============================================================
   INVESTMENT CATEGORY
============================================================ */

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

/* ============================================================
   PROJECT STATUS
============================================================ */

export type InvestmentStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type FundingStatus =
  | "OPEN"
  | "FUNDED"
  | "CLOSED";

/* ============================================================
   APPLICATION / PAYMENT
============================================================ */

export type InvestmentApplicationStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type InvestmentPaymentMethod =
  | "BANK_TRANSFER"
  | "STRIPE";

export type InvestmentPaymentStatus =
  | "NOT_STARTED"
  | "AWAITING_PAYMENT"
  | "PENDING_VERIFICATION"
  | "PAID"
  | "PAYMENT_REJECTED"
  | "FAILED";

/* ============================================================
   PROJECT
============================================================ */

export interface InvestmentProject {
  _id: string;

  projectCode: string;

  farmerId: string;

  farmerName?: string;

  farmerEmail?: string;

  /**
   * Legacy compatibility only.
   *
   * New projects no longer require an existing Farm.
   */
  farmId?: string;

  farmName?: string;

  projectName: string;

  category:
    InvestmentCategory;

  /* ==========================================================
     INVESTMENT TERMS
  ========================================================== */

  requiredInvestment: number;

  minimumInvestment: number;

  fundedAmount: number;

  durationMonths: number;

  /**
   * Projected ROI for the entire project term.
   *
   * Example:
   * 15 = projected 15% return.
   */
  expectedReturnPercent: number;

  /* ==========================================================
     LOCATION
  ========================================================== */

  division: string;

  district: string;

  upazila: string;

  address?: string;

  /* ==========================================================
     PROJECT INFORMATION
  ========================================================== */

  description: string;

  useOfFunds: string;

  projectImage?: string;

  supportingDocument?: string;

  /* ==========================================================
     STATUS
  ========================================================== */

  status:
    InvestmentStatus;

  fundingStatus:
    FundingStatus;

  adminNote?: string;

  reviewedAt?: string;

  approvedAt?: string;

  createdAt: string;

  updatedAt: string;

  /* ==========================================================
     LEGACY FIELDS

     Optional only so old database/client data does not break.
     Do not use these for new project UI.
  ========================================================== */

  ownContribution?: number;

  investorSharePercent?: number;

  duration?: string;

  expectedReturn?: string;

  profitSharing?: string;

  estimatedRevenue?: number;

  estimatedCost?: number;

  estimatedProfit?: number;
}

/* ============================================================
   CREATE PROJECT
============================================================ */

export interface CreateInvestmentProjectPayload {
  projectName: string;

  category:
    InvestmentCategory;

  requiredInvestment: number;

  minimumInvestment: number;

  durationMonths: number;

  expectedReturnPercent: number;

  division: string;

  district: string;

  upazila: string;

  address?: string;

  description: string;

  useOfFunds: string;

  projectImage?: string;

  supportingDocument?: string;
}

/* ============================================================
   UPDATE PROJECT
============================================================ */

export type UpdateInvestmentProjectPayload =
  Partial<CreateInvestmentProjectPayload>;

/* ============================================================
   INVESTMENT APPLICATION
============================================================ */

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

  /**
   * Admin API only.
   */
  nidNumber?: string;

  amount: number;

  /**
   * Snapshot of investment terms.
   */
  expectedReturnPercent?: number;

  durationMonths?: number;

  note?: string;

  paymentMethod:
    InvestmentPaymentMethod;

  status:
    InvestmentApplicationStatus;

  adminNote?: string;

  reviewedAt?: string;

  paymentStatus:
    InvestmentPaymentStatus;

  senderBankName?: string;

  transactionReference?: string;

  paymentProofUrl?: string;

  stripeSessionId?: string;

  stripePaymentIntentId?: string;

  paymentAdminNote?: string;

  paymentReviewedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   CREATE APPLICATION
============================================================ */

export interface CreateInvestmentApplicationPayload {
  amount: number;

  nidNumber: string;

  note?: string;

  paymentMethod:
    InvestmentPaymentMethod;
}

/* ============================================================
   LIST RESPONSE
============================================================ */

export interface InvestmentListResponse<T> {
  meta: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };

  data: T[];
}