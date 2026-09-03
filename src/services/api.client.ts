import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: tokenData } = await authClient.token();
    const token = tokenData?.token;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  } catch {
    return { "Content-Type": "application/json" };
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  queryString?: string
): Promise<T> {
  const headers = await getAuthHeaders();
  
  let url = `${BASE_URL}${endpoint}`;
  if (queryString) {
    url += `?${queryString}`;
  }

  const options: RequestInit = {
    method,
    headers,
    cache: "no-store",
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(url, options);
  return res.json();
}