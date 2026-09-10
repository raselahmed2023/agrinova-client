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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const { data } =
      await authClient.token();

    if (data?.token) {
      headers.Authorization =
        `Bearer ${data.token}`;
    }
  } catch {
    // Public marketplace endpoints
    // can continue without auth.
  }

  return headers;
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
  const cleanEndpoint =
    endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

  const url = new URL(
    `${BASE_URL}${cleanEndpoint}`
  );

  if (queryString) {
    new URLSearchParams(
      queryString
    ).forEach((value, key) => {
      url.searchParams.set(
        key,
        value
      );
    });
  }

  const response = await fetch(
    url.toString(),
    {
      method,
      headers:
        await getAuthHeaders(),
      cache: "no-store",
      credentials: "include",
      ...(body !== undefined
        ? {
            body: JSON.stringify(
              body
            ),
          }
        : {}),
    }
  );

  let result:
    | ApiEnvelope<T>
    | null = null;

  try {
    result =
      await response.json();
  } catch {
    throw new Error(
      `API returned an invalid response (${response.status}).`
    );
  }

  if (
    !response.ok ||
    !result?.success
  ) {
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