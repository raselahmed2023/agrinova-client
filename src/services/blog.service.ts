import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import {
  uploadImageRemote,
} from "@/lib/image-storage";

import type {
  IBlog,
  IBlogComment,
  IBlogFormData,
  IBlogReply,
  IBlogSingleResponse,
} from "@/types/blog";

/* ============================================================
   GET PUBLIC BLOGS
============================================================ */

export async function getBlogs(
  params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }
) {
  const query =
    new URLSearchParams();

  if (
    params?.search
  ) {
    query.set(
      "search",
      params.search
    );
  }

  if (
    params?.category &&
    params.category !==
      "All"
  ) {
    query.set(
      "category",
      params.category
    );
  }

  if (
    params?.page
  ) {
    query.set(
      "page",
      String(
        params.page
      )
    );
  }

  if (
    params?.limit
  ) {
    query.set(
      "limit",
      String(
        params.limit
      )
    );
  }

  const result =
    await apiRequestWithMeta<
      IBlog[]
    >(
      "/blogs",
      "GET",
      undefined,
      query.toString()
    );

  return {
    blogs:
      result.data,

    meta:
      result.meta,
  };
}

/* ============================================================
   EXPERT BLOGS
============================================================ */

export const getMyBlogs =
  () =>
    apiRequest<
      IBlog[]
    >(
      "/blogs/mine",
      "GET"
    );

/* ============================================================
   SINGLE BLOG
============================================================ */

export const getBlogByIdOrSlug =
  (
    idOrSlug:
      string
  ) =>
    apiRequest<
      IBlogSingleResponse
    >(
      `/blogs/${encodeURIComponent(
        idOrSlug
      )}`,
      "GET"
    );

/* ============================================================
   CREATE
============================================================ */

export const createBlog =
  (
    payload:
      IBlogFormData
  ) =>
    apiRequest<
      IBlog
    >(
      "/blogs",
      "POST",
      payload
    );

/* ============================================================
   UPDATE
============================================================ */

export const updateBlog =
  (
    id:
      string,

    payload:
      Partial<IBlogFormData>
  ) =>
    apiRequest<
      IBlog
    >(
      `/blogs/${encodeURIComponent(
        id
      )}`,
      "PATCH",
      payload
    );

/* ============================================================
   DELETE
============================================================ */

export const deleteBlog =
  (
    id:
      string
  ) =>
    apiRequest<{
      deleted:
        boolean;
    }>(
      `/blogs/${encodeURIComponent(
        id
      )}`,
      "DELETE"
    );

/* ============================================================
   COMMENTS
============================================================ */

export const addBlogComment =
  (
    id:
      string,

    content:
      string
  ) =>
    apiRequest<
      IBlogComment
    >(
      `/blogs/${encodeURIComponent(
        id
      )}/comments`,
      "POST",
      {
        content,
      }
    );

/* ============================================================
   REPLIES
============================================================ */

export const addBlogReply =
  (
    id:
      string,

    commentId:
      string,

    content:
      string
  ) =>
    apiRequest<
      IBlogReply
    >(
      `/blogs/${encodeURIComponent(
        id
      )}/comments/${encodeURIComponent(
        commentId
      )}/replies`,
      "POST",
      {
        content,
      }
    );

/* ============================================================
   BLOG IMAGE UPLOAD

   IMPORTANT:
   Uses the same working Vercel uploader as:
   - Community
   - Farm
   - Marketplace
   - Investment

   It no longer calls:
   /blogs/upload-image
============================================================ */

export async function uploadBlogImage(
  file:
    File
): Promise<string> {
  return uploadImageRemote(
    file,
    "blog-cover"
  );
}