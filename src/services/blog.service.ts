import { authClient } from "@/lib/auth-client";
import { apiRequest, apiRequestWithMeta } from "./api.client";
import type { IBlog, IBlogComment, IBlogFormData, IBlogReply, IBlogSingleResponse } from "@/types/blog";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

export async function getBlogs(params?: { search?: string; category?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category && params.category !== "All") query.set("category", params.category);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const result = await apiRequestWithMeta<IBlog[]>("/blogs", "GET", undefined, query.toString());
  return { blogs: result.data, meta: result.meta };
}

export const getMyBlogs = () => apiRequest<IBlog[]>("/blogs/mine", "GET");
export const getBlogByIdOrSlug = (idOrSlug: string) => apiRequest<IBlogSingleResponse>(`/blogs/${encodeURIComponent(idOrSlug)}`, "GET");
export const createBlog = (payload: IBlogFormData) => apiRequest<IBlog>("/blogs", "POST", payload);
export const updateBlog = (id: string, payload: Partial<IBlogFormData>) => apiRequest<IBlog>(`/blogs/${encodeURIComponent(id)}`, "PATCH", payload);
export const deleteBlog = (id: string) => apiRequest<{ deleted: boolean }>(`/blogs/${encodeURIComponent(id)}`, "DELETE");
export const addBlogComment = (id: string, content: string) => apiRequest<IBlogComment>(`/blogs/${encodeURIComponent(id)}/comments`, "POST", { content });
export const addBlogReply = (id: string, commentId: string, content: string) => apiRequest<IBlogReply>(`/blogs/${encodeURIComponent(id)}/comments/${encodeURIComponent(commentId)}/replies`, "POST", { content });

export async function uploadBlogImage(file: File): Promise<string> {
  const { data } = await authClient.token();
  if (!data?.token) throw new Error("Please sign in as an expert to upload an image");
  const body = new FormData();
  body.append("image", file);
  const response = await fetch(`${BASE_URL}/blogs/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${data.token}` },
    body,
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok || !result?.success || !result?.data?.url) {
    throw new Error(result?.message || "ImgBB upload failed");
  }
  return String(result.data.url);
}
