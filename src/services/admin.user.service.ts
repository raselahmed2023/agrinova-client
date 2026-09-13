import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

export interface AdminUserItem {
  _id: string;

  id?: string;

  name: string;

  email: string;

  role:
    | "FARMER"
    | "EXPERT"
    | "ADMIN"
    | string;

  status:
    | "APPROVED"
    | "PENDING"
    | "REJECTED"
    | "BLOCKED"
    | "ACTIVE"
    | string;

  phone?: string;

  avatar?: string;
  image?: string;

  emailVerified?: boolean;

  specialization?:
    | string
    | string[];

  qualification?: string;

  experienceYears?: number;

  rejectionReason?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface AdminListMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


export type AdminUser =
  AdminUserItem;

export type AdminUserMeta =
  AdminListMeta;

const normalizeMeta = (
  meta:
    | Record<
        string,
        unknown
      >
    | undefined,

  fallbackLength:
    number
): AdminListMeta => ({
  page:
    Number(
      meta?.page ||
        1
    ),

  limit:
    Number(
      meta?.limit ||
        fallbackLength ||
        10
    ),

  total:
    Number(
      meta?.total ??
        fallbackLength
    ),

  totalPages:
    Math.max(
      Number(
        meta?.totalPages ||
          1
      ),
      1
    ),
});

export const adminUserService = {
  async getUsers(
    queryString?: string
  ) {
    const result =
      await apiRequestWithMeta<
        AdminUserItem[]
      >(
        "/admin/users",
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

      meta:
        normalizeMeta(
          result.meta,
          data.length
        ),
    };
  },

  getUserById(
    userId:
      string
  ) {
    return apiRequest<AdminUserItem>(
      `/admin/users/${encodeURIComponent(
        userId
      )}`
    );
  },

  blockUser(
    userId:
      string
  ) {
    return apiRequest<AdminUserItem>(
      `/admin/users/${encodeURIComponent(
        userId
      )}/block`,
      "PATCH"
    );
  },

  unblockUser(
    userId:
      string
  ) {
    return apiRequest<AdminUserItem>(
      `/admin/users/${encodeURIComponent(
        userId
      )}/unblock`,
      "PATCH"
    );
  },

  getAdminProfile() {
    return apiRequest<AdminUserItem>(
      "/admin/profile"
    );
  },

  updateAdminProfile(
    data: {
      name?: string;

      phone?: string;
    }
  ) {
    return apiRequest<AdminUserItem>(
      "/admin/profile",
      "PATCH",
      data
    );
  },
};