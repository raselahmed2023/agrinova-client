import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  CommunityComment,
  CommunityFarmerProfile,
  CommunityPost,
  CommunityProfileResponse,
  CommunityReply,
} from "@/types/community";



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
        page:
          String(page),

        limit:
          String(limit),
      }).toString()
    );

  return {
    posts:
      Array.isArray(
        result.data
      )
        ? result.data
        : [],

    meta:
      result.meta,
  };
}



export function createCommunityPost(
  payload: {
    content: string;

    images?:
      string[];
  }
) {
  return apiRequest<CommunityPost>(
    "/community/posts",
    "POST",
    payload
  );
}

export function updateCommunityPost(
  postId: string,

  payload: {
    content?: string;

    images?:
      string[];
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


export function getCommunityFarmerProfile(
  farmerId: string,
  page = 1,
  limit = 20
) {
  return apiRequest<CommunityProfileResponse>(
    `/community/farmers/${encodeURIComponent(
      farmerId
    )}`,

    "GET",

    undefined,

    new URLSearchParams({
      page:
        String(page),

      limit:
        String(limit),
    }).toString()
  );
}

export function getMyCommunityProfile() {
  return apiRequest<CommunityFarmerProfile>(
    "/community/me",
    "GET"
  );
}

export function updateMyCommunityProfile(
  payload: {
    avatar?: string;

    location?: string;
  }
) {
  return apiRequest<CommunityFarmerProfile>(
    "/community/me",

    "PATCH",

    payload
  );
}



export async function uploadCommunityImage(
  file: File
): Promise<string> {
  if (
    !file.type.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "Please choose an image file."
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
      "/api/upload",

      {
        method:
          "POST",

        body,
      }
    );

  const result =
    await response.json();

  if (
    !response.ok ||
    !result?.success ||
    !result?.url
  ) {
    throw new Error(
      result?.message ||
        "Image upload failed."
    );
  }

  return String(
    result.url
  );
}



export async function getAdminCommunityPosts(
  status =
    "ALL",

  search =
    "",

  page =
    1
) {
  const query =
    new URLSearchParams({
      status,
      search,

      page:
        String(page),

      limit:
        "20",
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
      result.data,

    meta:
      result.meta,
  };
}

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