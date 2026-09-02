import { apiRequest } from "./api.client";

export interface IUserQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  [key: string]: unknown;
}

export const adminUserService = {
  async getUsers(queryString?: string) {
    return apiRequest<unknown>("/admin/users", "GET", undefined, queryString);
  },

  async getUserById(userId: string) {
    return apiRequest<unknown>(`/admin/users/${userId}`);
  },

  async blockUser(userId: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/block`, "PATCH");
  },

  async unblockUser(userId: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/unblock`, "PATCH");
  },

  async getAdminProfile() {
    return apiRequest<unknown>("/admin/profile");
  },

  async updateAdminProfile(data: { name?: string; phone?: string }) {
    return apiRequest<unknown>("/admin/profile", "PATCH", data);
  }
};