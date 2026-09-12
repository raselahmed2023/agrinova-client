import { authClient } from "@/lib/auth-client";

import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  CommunityComment,
  CommunityPost,
  CommunityProfileResponse,
  CommunityReply,
} from "@/types/community";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

/* ============================================================
   PUBLIC COMMUNITY FEED

   Logged-out users can read:
   - posts
   - comments
   - replies
============================================================ */

export async function getCommunityFeed(
  page = 1,
  limit = 10
) {
  const result =
    await apiRequestWithMeta<
      CommunityPost[]
    >(
      "/community/feed",
      "GET",
      undefined,
      new URLSearchParams({
        page: String(page),
        limit: String(limit),
      }).toString()
    );

  return {
    posts:
      Array.isArray(result.data)
        ? result.data
        : [],

    meta:
      result.meta,
  };
}

/* ============================================================
   CREATE POST
   FARMER ONLY
============================================================ */

export function createCommunityPost(
  payload: {
    content: string;
    images?: string[];
  }
) {
  return apiRequest<CommunityPost>(
    "/community/posts",
    "POST",
    payload
  );
}

/* ============================================================
   UPDATE OWN POST
   FARMER ONLY
============================================================ */

export function updateCommunityPost(
  postId: string,
  payload: {
    content?: string;
    images?: string[];
  }
) {
  return apiRequest<CommunityPost>(
    `/community/posts/${encodeURIComponent(
      postId
    )}`,
    "PATCH",
    payload
  );
}

/* ============================================================
   DELETE OWN POST
   FARMER ONLY
============================================================ */

export function deleteCommunityPost(
  postId: string
) {
  return apiRequest<{
    deleted: boolean;
  }>(
    `/community/posts/${encodeURIComponent(
      postId
    )}`,
    "DELETE"
  );
}

/* ============================================================
   LIKE / UNLIKE
   FARMER ONLY
============================================================ */

export function toggleCommunityLike(
  postId: string
) {
  return apiRequest<CommunityPost>(
    `/community/posts/${encodeURIComponent(
      postId
    )}/like`,
    "POST"
  );
}

/* ============================================================
   COMMENT
   FARMER ONLY
============================================================ */

export function addCommunityComment(
  postId: string,
  content: string
) {
  return apiRequest<CommunityComment>(
    `/community/posts/${encodeURIComponent(
      postId
    )}/comments`,
    "POST",
    {
      content,
    }
  );
}

/* ============================================================
   REPLY
   FARMER ONLY
============================================================ */

export function addCommunityReply(
  postId: string,
  commentId: string,
  content: string
) {
  return apiRequest<CommunityReply>(
    `/community/posts/${encodeURIComponent(
      postId
    )}/comments/${encodeURIComponent(
      commentId
    )}/replies`,
    "POST",
    {
      content,
    }
  );
}

/* ============================================================
   FARMER COMMUNITY PROFILE

   LOGIN REQUIRED.
   Backend also requires FARMER role.

   Public visitors cannot use this API.
============================================================ */

export function getCommunityFarmerProfile(
  farmerId: string,
  page = 1,
  limit = 10
) {
  return apiRequest<CommunityProfileResponse>(
    `/community/farmers/${encodeURIComponent(
      farmerId
    )}`,
    "GET",
    undefined,
    new URLSearchParams({
      page: String(page),
      limit: String(limit),
    }).toString()
  );
}

/* ============================================================
   COMMUNITY IMAGE UPLOAD

   Uses server-side ImgBB.
   FARMER ONLY.
============================================================ */

export async function uploadCommunityImage(
  file: File
): Promise<string> {
  const { data } =
    await authClient.token();

  if (!data?.token) {
    throw new Error(
      "Please sign in as a farmer to upload an image."
    );
  }

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "Please select a valid image."
    );
  }

  if (
    file.size >
    8 * 1024 * 1024
  ) {
    throw new Error(
      "Image must be 8 MB or smaller."
    );
  }

  const body =
    new FormData();

  body.append(
    "image",
    file
  );

  const response =
    await fetch(
      `${BASE_URL}/community/upload-image`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${data.token}`,
        },

        body,

        credentials:
          "include",
      }
    );

  let result:
    | {
        success?: boolean;
        message?: string;
        data?: {
          url?: string;
        };
      }
    | null = null;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      "Image upload returned an invalid response."
    );
  }

  if (
    !response.ok ||
    !result?.success ||
    !result.data?.url
  ) {
    throw new Error(
      result?.message ||
        "Community image upload failed."
    );
  }

  return String(
    result.data.url
  );
}

/* ============================================================
   ADMIN COMMUNITY POSTS
============================================================ */

export async function getAdminCommunityPosts(
  status = "ALL",
  search = "",
  page = 1
) {
  const query =
    new URLSearchParams({
      status,
      search,
      page: String(page),
      limit: "20",
    });

  const result =
    await apiRequestWithMeta<
      CommunityPost[]
    >(
      "/community/admin/posts",
      "GET",
      undefined,
      query.toString()
    );

  return {
    posts:
      Array.isArray(result.data)
        ? result.data
        : [],

    meta:
      result.meta,
  };
}

/* ============================================================
   ADMIN REMOVE POST + WARNING
============================================================ */

export function removeCommunityPostByAdmin(
  postId: string,
  reason: string
) {
  return apiRequest<CommunityPost>(
    `/community/admin/posts/${encodeURIComponent(
      postId
    )}/remove`,
    "PATCH",
    {
      reason,
    }
  );
}

/* ============================================================
   ADMIN WARNING ONLY
============================================================ */

export function warnCommunityFarmerByAdmin(
  postId: string,
  reason: string
) {
  return apiRequest<{
    warned: boolean;
    postId?: string;
  }>(
    `/community/admin/posts/${encodeURIComponent(
      postId
    )}/warn`,
    "POST",
    {
      reason,
    }
  );
}

/* ============================================================
   OPTIONAL SERVICE OBJECT
============================================================ */

export const CommunityService = {
  getCommunityFeed,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  toggleCommunityLike,
  addCommunityComment,
  addCommunityReply,
  getCommunityFarmerProfile,
  uploadCommunityImage,
  getAdminCommunityPosts,
  removeCommunityPostByAdmin,
  warnCommunityFarmerByAdmin,
};