import { apiRequest, apiRequestWithMeta } from "./api.client";
import type {
  InvestmentApplication,
  InvestmentListResponse,
  InvestmentProject,
  InvestmentApplicationStatus,
  InvestmentPaymentStatus,
} from "@/types/investment";

const withMeta = async <T>(endpoint: string, queryString?: string): Promise<InvestmentListResponse<T>> => {
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

export const investmentAdminService = {
  getProjects: (queryString?: string) =>
    withMeta<InvestmentProject>("/investments/admin/projects", queryString),

  getProject: (projectId: string) =>
    apiRequest<InvestmentProject>(`/investments/admin/projects/${projectId}`),

  approveProject: (projectId: string) =>
    apiRequest<InvestmentProject>(`/investments/admin/projects/${projectId}/review`, "PATCH", {
      status: "APPROVED",
    }),

  rejectProject: (projectId: string, adminNote: string) =>
    apiRequest<InvestmentProject>(`/investments/admin/projects/${projectId}/review`, "PATCH", {
      status: "REJECTED",
      adminNote,
    }),

  getApplications: (queryString?: string) =>
    withMeta<InvestmentApplication>("/investments/admin/applications", queryString),

  reviewApplication: (
    applicationId: string,
    status: InvestmentApplicationStatus,
    adminNote?: string
  ) =>
    apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/review`,
      "PATCH",
      { status, adminNote }
    ),

  reviewBankPayment: (
    applicationId: string,
    paymentStatus: InvestmentPaymentStatus,
    paymentAdminNote?: string
  ) =>
    apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/payment-review`,
      "PATCH",
      { paymentStatus, paymentAdminNote }
    ),
};