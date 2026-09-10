import { authClient } from "@/lib/auth-client";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
}

async function getAuthHeaders(): Promise<
  Record<string, string>
> {
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const { data } = await authClient.token();

    if (data?.token) {
      requestHeaders.Authorization =
        `Bearer ${data.token}`;
    }
  } catch (error) {
    console.warn(
      "Could not retrieve authentication token:",
      error
    );
  }

  return requestHeaders;
}

export async function apiRequest<T>(
  endpoint: string,
  method:
    | "GET"
    | "POST"
    | "PATCH"
    | "DELETE" = "GET",
  body?: unknown,
  queryString?: string
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = new URL(
    `${BASE_URL}${cleanEndpoint}`
  );

  if (queryString) {
    const params = new URLSearchParams(queryString);

    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  const headers = await getAuthHeaders();

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      cache: "no-store",
      credentials: "include",
      ...(body !== undefined
        ? {
            body: JSON.stringify(body),
          }
        : {}),
    });
  } catch (error) {
    console.error(
      "API connection failed:",
      {
        url: url.toString(),
        method,
        error,
      }
    );

    throw new Error(
      `Unable to connect to the backend server at ${BASE_URL}.`
    );
  }

  let result: ApiEnvelope<T> | null = null;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      `API returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  const data = result.data;
  if (data && typeof data === "object") {
    if (!("success" in data)) {
      Object.defineProperty(data, "success", {
        value: result.success,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    if (result.meta !== undefined && !("meta" in data)) {
      Object.defineProperty(data, "meta", {
        value: result.meta,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    if (!("data" in data)) {
      Object.defineProperty(data, "data", {
        value: data,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
  }

  return data;
}