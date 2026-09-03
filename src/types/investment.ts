export type InvestmentStatus =
  | "Pending Review"
  | "Open for Investment"
  | "Fully Funded"
  | "Ongoing"
  | "Completed"
  | "Rejected"
  | "Closed";

export interface InvestmentProject {
  _id: string;
  farmerId: string;
  projectTitle: string;
  category: string;
  requiredInvestment: number;
  projectedProfit: number;
  duration: string;
  location: string;
  projectImage: string;
  description: string;
  receivedInvestment: number;
  status: InvestmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentProjectPayload {
  projectTitle: string;
  nidNumber: string;
  category: string;
  requiredInvestment: number;
  projectedProfit: number;
  duration: string;
  location: string;
  projectImage: string;
  description: string;
  supportingDocument: string;
}