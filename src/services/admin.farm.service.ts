import { apiRequest } from "./api.client";

export const adminFarmService = {
  async getAdminFarms(queryString?: string) {
    return apiRequest<unknown>("/admin/farms", "GET", undefined, queryString);
  },

  async getAdminFarmById(farmId: string) {
    return apiRequest<unknown>(`/admin/farms/${farmId}`);
  }
};