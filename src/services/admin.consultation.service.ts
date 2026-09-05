import { apiRequest } from "./api.client";

export const consultationService = {
  async getAdminConsultations(queryString?: string) {
    return apiRequest<unknown>("/admin/consultations", "GET", undefined, queryString);
  },

  async getAdminConsultationById(consultationId: string) {
    return apiRequest<unknown>(`/admin/consultations/${consultationId}`);
  },

  async getDashboard() {
    return apiRequest<unknown>("/admin/dashboard");
  },

  async getAdminAnalytics() {
    return apiRequest<unknown>("/admin/analytics");
  }
};