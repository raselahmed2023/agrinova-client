import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  AdminListMeta,
} from "./admin.user.service";

export interface AdminConsultationItem {
  _id: string;

  farmerName?: string;

  userId?: string;

  expertName?: string;

  expertId?: string;

  topic?: string;

  consultationType?: string;

  status?: string;

  scheduledDate?: string;

  scheduledTime?: string;

  scheduledAt?: string;

  date?: string;

  createdAt?: string;

  updatedAt?: string;

  [key: string]:
    unknown;
}

export const consultationService = {
  async getAdminConsultations(
    queryString?: string
  ): Promise<{
    data:
      AdminConsultationItem[];

    meta:
      AdminListMeta;
  }> {
    const result =
      await apiRequestWithMeta<
        AdminConsultationItem[]
      >(
        "/admin/consultations",
        "GET",
        undefined,
        queryString
      );

    const data =
      Array.isArray(
        result.data
      )
        ? result.data
        : [];

    return {
      data,

      meta: {
        page:
          Number(
            result.meta
              ?.page ||
              1
          ),

        limit:
          Number(
            result.meta
              ?.limit ||
              data.length ||
              10
          ),

        total:
          Number(
            result.meta
              ?.total ??
              data.length
          ),

        totalPages:
          Math.max(
            Number(
              result.meta
                ?.totalPages ||
                1
            ),
            1
          ),
      },
    };
  },

  getAdminConsultationById(
    consultationId:
      string
  ) {
    return apiRequest<AdminConsultationItem>(
      `/admin/consultations/${encodeURIComponent(
        consultationId
      )}`
    );
  },

  
  getDashboard() {
    return apiRequest<unknown>(
      "/admin/dashboard"
    );
  },

  getAdminAnalytics() {
    return apiRequest<unknown>(
      "/admin/analytics"
    );
  },
};