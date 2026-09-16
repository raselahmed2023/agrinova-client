import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  AdminListMeta,
} from "./admin.user.service";

export interface AdminExpertItem {
  _id: string;

  id?: string;

  name: string;

  email: string;

  role: string;

  status: string;

  specialization?:
    | string
    | string[];

  qualification?: string;

  experienceYears?: number;

  phone?: string;

  avatar?: string;

  image?: string;

  rejectionReason?: string;

  createdAt?: string;

  updatedAt?: string;
}


export type AdminExpert =
  AdminExpertItem;

export const adminExpertService = {
  async getPendingExperts(
    queryString?: string
  ): Promise<{
    data:
      AdminExpertItem[];

    meta:
      AdminListMeta;
  }> {
    const result =
      await apiRequestWithMeta<
        AdminExpertItem[]
      >(
        "/admin/experts/pending",
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

  getExpertById(
    expertId:
      string
  ) {
    return apiRequest<AdminExpertItem>(
      `/admin/experts/${encodeURIComponent(
        expertId
      )}`
    );
  },

  approveExpert(
    expertId:
      string
  ) {
    return apiRequest<AdminExpertItem>(
      `/admin/experts/${encodeURIComponent(
        expertId
      )}/approve`,
      "PATCH"
    );
  },

  rejectExpert(
    expertId:
      string,

    reason?:
      string
  ) {
    return apiRequest<AdminExpertItem>(
      `/admin/experts/${encodeURIComponent(
        expertId
      )}/reject`,
      "PATCH",
      {
        reason,
      }
    );
  },
};