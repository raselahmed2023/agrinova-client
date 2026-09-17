import {
  apiRequest,
} from "./api.client";

export interface AdminExpert {
  _id: string;

  name: string;

  email: string;

  role?: string;

  status: string;

  phone?: string;

  specialization?: string;

  qualification?: string;

  experienceYears?: number;

  avatar?: string;

  image?: string;

  rejectionReason?: string;

  createdAt?: string;

  updatedAt?: string;
}

export const adminExpertService =
  {
    /**
     * apiRequest already unwraps:
     *
     * {
     *   success: true,
     *   data: [...]
     * }
     *
     * therefore this returns AdminExpert[]
     * directly.
     */
    async getPendingExperts() {
      return apiRequest<
        AdminExpert[]
      >(
        "/admin/experts/pending"
      );
    },

    async getExpertById(
      expertId:
        string
    ) {
      return apiRequest<
        AdminExpert
      >(
        `/admin/experts/${expertId}`
      );
    },

    async approveExpert(
      expertId:
        string
    ) {
      return apiRequest<
        AdminExpert
      >(
        `/admin/experts/${expertId}/approve`,
        "PATCH"
      );
    },

    async rejectExpert(
      expertId:
        string,
      reason?:
        string
    ) {
      return apiRequest<
        AdminExpert
      >(
        `/admin/experts/${expertId}/reject`,
        "PATCH",
        {
          reason:
            reason ||
            "",
        }
      );
    },
  };