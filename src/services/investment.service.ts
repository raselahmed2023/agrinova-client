import { authClient } from "@/lib/auth-client";
import type {
  CreateInvestmentProjectPayload,
  InvestmentProject,
} from "@/types/investment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createInvestmentProject = async (
  payload: CreateInvestmentProjectPayload
): Promise<InvestmentProject> => {
  const { data: tokenData } = await authClient.token();

  if (!tokenData?.token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${API_URL}/investments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create investment project");
  }

  return result.data;
};

export const getMyInvestmentProjects = async (): Promise<
  InvestmentProject[]
> => {
  const { data: tokenData } = await authClient.token();

  if (!tokenData?.token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${API_URL}/investments/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load investment projects");
  }

  return result.data;
};