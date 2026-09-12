import { apiRequest, apiRequestWithMeta } from "./api.client";
import type {
  CreateInvestmentApplicationPayload,
  CreateInvestmentProjectPayload,
  InvestmentApplication,
  InvestmentListResponse,
  InvestmentProject,
} from "@/types/investment";

const listWithMeta = async <T>(endpoint: string, queryString?: string): Promise<InvestmentListResponse<T>> => {
  const result = await apiRequestWithMeta<T[]>(endpoint, "GET", undefined, queryString);
  return {
    data: result.data,
    meta: {
      page: Number(result.meta?.page || 1),
      limit: Number(result.meta?.limit || result.data.length || 1),
      total: Number(result.meta?.total || result.data.length),
      totalPages: Number(result.meta?.totalPages || 1),
    },
  };
};

export const createInvestmentProject = (payload: CreateInvestmentProjectPayload) =>
  apiRequest<InvestmentProject>("/investments", "POST", payload);

export const getMyInvestmentProjects = () =>
  apiRequest<InvestmentProject[]>("/investments/me", "GET");

export const getMyInvestmentProject = (projectId: string) =>
  apiRequest<InvestmentProject>(`/investments/me/${projectId}`, "GET");

export const updateMyInvestmentProject = (projectId: string, payload: Partial<CreateInvestmentProjectPayload>) =>
  apiRequest<InvestmentProject>(`/investments/me/${projectId}`, "PATCH", payload);

export const deleteMyInvestmentProject = (projectId: string) =>
  apiRequest<InvestmentProject>(`/investments/me/${projectId}`, "DELETE");

export const getApprovedInvestmentProjects = (queryString?: string) =>
  listWithMeta<InvestmentProject>("/investments", queryString);

export const getApprovedInvestmentProject = (projectId: string) =>
  apiRequest<InvestmentProject>(`/investments/${projectId}`, "GET");

export const createInvestmentApplication = (projectId: string, payload: CreateInvestmentApplicationPayload) =>
  apiRequest<InvestmentApplication>(`/investments/${projectId}/apply`, "POST", payload);

export const getMyInvestmentApplications = () =>
  apiRequest<InvestmentApplication[]>("/investments/my-investments", "GET");

export const submitBankInvestmentPayment = (
  applicationId: string,
  payload: { senderBankName: string; transactionReference: string; paymentProofUrl: string }
) => apiRequest<InvestmentApplication>(`/investments/my-investments/${applicationId}/bank-payment`, "POST", payload);

export const createInvestmentStripeCheckout = (applicationId: string) =>
  apiRequest<{ sessionId: string; url: string | null }>(`/investments/my-investments/${applicationId}/stripe-checkout`, "POST");

export const verifyInvestmentStripeCheckout = (applicationId: string, sessionId: string) =>
  apiRequest<InvestmentApplication>(
    `/investments/my-investments/${applicationId}/stripe-verify`,
    "GET",
    undefined,
    new URLSearchParams({ sessionId }).toString()
  );
