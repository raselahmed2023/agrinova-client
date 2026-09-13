import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  IBlog,
} from "@/types/blog";

import type {
  AdminListMeta,
} from "./admin.user.service";

export const adminBlogService = {
  async getBlogs(
    params: {
      page?: number;
      limit?: number;
      search?: string;

      status?:
        | "ALL"
        | "PUBLISHED"
        | "DRAFT";
    } = {}
  ): Promise<{
    data: IBlog[];
    meta: AdminListMeta;
  }> {
    const query =
      new URLSearchParams();

    if (params.page) {
      query.set(
        "page",
        String(params.page)
      );
    }

    if (params.limit) {
      query.set(
        "limit",
        String(params.limit)
      );
    }

    if (params.search) {
      query.set(
        "search",
        params.search
      );
    }

    if (
      params.status &&
      params.status !== "ALL"
    ) {
      query.set(
        "status",
        params.status
      );
    }

    const result =
      await apiRequestWithMeta<
        IBlog[]
      >(
        "/blogs/admin",
        "GET",
        undefined,
        query.toString()
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
        page: Number(
          result.meta?.page ||
            1
        ),

        limit: Number(
          result.meta?.limit ||
            params.limit ||
            12
        ),

        total: Number(
          result.meta?.total ??
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

  setStatus(
    id: string,

    status:
      | "PUBLISHED"
      | "DRAFT"
  ) {
    return apiRequest<IBlog>(
      `/blogs/admin/${encodeURIComponent(
        id
      )}/status`,
      "PATCH",
      {
        status,
      }
    );
  },

  remove(
    id: string
  ) {
    return apiRequest<{
      deleted: boolean;
    }>(
      `/blogs/admin/${encodeURIComponent(
        id
      )}`,
      "DELETE"
    );
  },
};