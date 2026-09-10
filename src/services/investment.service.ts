import { apiRequest } from "./api.client";

import type {
  CreateInvestmentProjectPayload,
  InvestmentListResponse,
  InvestmentProject,
} from "@/types/investment";

export const createInvestmentProject =
  async (
    payload: CreateInvestmentProjectPayload
  ): Promise<InvestmentProject> => {
    return apiRequest<InvestmentProject>(
      "/investments",
      "POST",
      payload
    );
  };

export const getMyInvestmentProjects =
  async (): Promise<InvestmentProject[]> => {
    return apiRequest<InvestmentProject[]>(
      "/investments/me",
      "GET"
    );
  };

export const getMyInvestmentProject =
  async (
    projectId: string
  ): Promise<InvestmentProject> => {
    return apiRequest<InvestmentProject>(
      `/investments/me/${projectId}`,
      "GET"
    );
  };

export const updateMyInvestmentProject =
  async (
    projectId: string,
    payload: Partial<CreateInvestmentProjectPayload>
  ): Promise<InvestmentProject> => {
    return apiRequest<InvestmentProject>(
      `/investments/me/${projectId}`,
      "PATCH",
      payload
    );
  };

export const deleteMyInvestmentProject =
  async (
    projectId: string
  ): Promise<InvestmentProject> => {
    return apiRequest<InvestmentProject>(
      `/investments/me/${projectId}`,
      "DELETE"
    );
  };

export const getApprovedInvestmentProjects =
  async (
    queryString?: string
  ): Promise<InvestmentListResponse> => {
    return apiRequest<InvestmentListResponse>(
      "/investments",
      "GET",
      undefined,
      queryString
    );
  };

export const getApprovedInvestmentProject =
  async (
    projectId: string
  ): Promise<InvestmentProject> => {
    return apiRequest<InvestmentProject>(
      `/investments/${projectId}`,
      "GET"
    );
  };