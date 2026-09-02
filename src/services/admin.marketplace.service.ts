import { apiRequest } from "./api.client";

export const marketplaceService = {
  async getAdminProducts(queryString?: string) {
    return apiRequest<unknown>("/admin/marketplace/products", "GET", undefined, queryString);
  },

  async getAdminProductById(productId: string) {
    return apiRequest<unknown>(`/admin/marketplace/products/${productId}`);
  },

  async disableProduct(productId: string) {
    return apiRequest<unknown>(`/admin/marketplace/products/${productId}/disable`, "PATCH");
  },

  async restoreProduct(productId: string) {
    return apiRequest<unknown>(`/admin/marketplace/products/${productId}/restore`, "PATCH");
  },

  async removeProduct(productId: string) {
    return apiRequest<unknown>(`/admin/marketplace/products/${productId}`, "DELETE");
  }
};