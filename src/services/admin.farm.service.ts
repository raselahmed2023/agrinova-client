import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  AdminListMeta,
} from "./admin.user.service";

export interface AdminFarmItem {
  _id: string;

  name: string;

  farmerId?: string;

  farmerName?: string;

  division?: string;

  district?: string;

  upazila?: string;

  location?: string;

  landArea?: number;

  unit?: string;

  soilType?: string;

  status?: string;

  coverImage?: string;

  createdAt?: string;

  updatedAt?: string;

  [key: string]:
    unknown;
}

export const adminFarmService = {
  async getAdminFarms(
    queryString?: string
  ): Promise<{
    data:
      AdminFarmItem[];

    meta:
      AdminListMeta;
  }> {
    const result =
      await apiRequestWithMeta<
        AdminFarmItem[]
      >(
        "/admin/farms",
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

  getAdminFarmById(
    farmId:
      string
  ) {
    return apiRequest<AdminFarmItem>(
      `/admin/farms/${encodeURIComponent(
        farmId
      )}`
    );
  },
};