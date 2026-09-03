import { apiRequest } from "./api.client";

export const adminExpertService = {
  async getPendingExperts() {
    return apiRequest<unknown>("/admin/experts/pending");
  },

  async getExpertById(expertId: string) {
    return apiRequest<unknown>(`/admin/experts/${expertId}`);
  },

  async approveExpert(expertId: string) {
    return apiRequest<unknown>(`/admin/experts/${expertId}/approve`, "PATCH");
  },

  async rejectExpert(expertId: string, reason?: string) {
    return apiRequest<unknown>(`/admin/experts/${expertId}/reject`, "PATCH", { reason });
  }
};