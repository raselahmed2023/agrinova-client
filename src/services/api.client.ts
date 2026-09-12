import { authClient } from "@/lib/auth-client";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
}

type ApiMethod =
  | "GET"
  | "POST"
  | "PATCH"
  | "DELETE";



async function getAuthHeaders(): Promise<
  Record<string, string>
> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") {
    return headers;
  }

  try {
    const { data } =
      await authClient.token();

    if (data?.token) {
      headers.Authorization =
        `Bearer ${data.token}`;
    }
  } catch (error) {
    console.warn(
      "Could not retrieve authentication token:",
      error
    );
  }

  return headers;
}



async function requestEnvelope<T>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: unknown,
  queryString?: string
): Promise<ApiEnvelope<T>> {
  const cleanEndpoint =
    endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

  const url = new URL(
    `${BASE_URL}${cleanEndpoint}`
  );

  if (queryString) {
    const params =
      new URLSearchParams(
        queryString
      );

    params.forEach(
      (value, key) => {
        url.searchParams.set(
          key,
          value
        );
      }
    );
  }

  const headers =
    await getAuthHeaders();

  let response: Response;

  try {
    response = await fetch(
      url.toString(),
      {
        method,

        headers,

        cache: "no-store",

        credentials:
          "include",

        ...(body !== undefined
          ? {
              body:
                JSON.stringify(
                  body
                ),
            }
          : {}),
      }
    );
  } catch (error) {
    console.error(
      "API connection failed:",
      {
        url:
          url.toString(),

        method,

        error,
      }
    );

    throw new Error(
      `Unable to connect to the backend server at ${BASE_URL}.`
    );
  }

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

  return result;
}



export async function apiRequest<T>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: unknown,
  queryString?: string
): Promise<T> {
  const result =
    await requestEnvelope<T>(
      endpoint,
      method,
      body,
      queryString
    );

  return result.data;
}



export async function apiRequestWithMeta<T>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: unknown,
  queryString?: string
): Promise<ApiEnvelope<T>> {
  return requestEnvelope<T>(
    endpoint,
    method,
    body,
    queryString
  );
}

export { BASE_URL };