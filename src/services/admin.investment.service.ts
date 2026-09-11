import { apiRequest } from "./api.client";

import type {
  InvestmentListResponse,
  InvestmentProject,
} from "@/types/investment";

export const investmentAdminService = {
  async getProjects(
    queryString?: string
  ) {
    return apiRequest<InvestmentListResponse>(
      "/investments/admin/projects",
      "GET",
      undefined,
      queryString
    );
  },

  async getProject(
    projectId: string
  ) {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}`,
      "GET"
    );
  },

  async approveProject(
    projectId: string
  ) {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}/review`,
      "PATCH",
      {
        status:
          "APPROVED",
      }
    );
  },

  async rejectProject(
    projectId: string,
    adminNote: string
  ) {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}/review`,
      "PATCH",
      {
        status:
          "REJECTED",
        adminNote,
      }
    );
  },
};