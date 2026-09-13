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

function normalizeEndpoint(
  endpoint: string
) {
  return endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
}


export async function getAccessToken(): Promise<string> {
  if (
    typeof window ===
    "undefined"
  ) {
    throw new Error(
      "Authentication token is only available in the browser."
    );
  }

  const {
    data: session,
  } =
    await authClient.getSession();

  if (!session?.user) {
    throw new Error(
      "Authentication required."
    );
  }

  const {
    data,
    error,
  } =
    await authClient.token();

  if (
    error ||
    !data?.token
  ) {
    throw new Error(
      error?.message ||
        "Unable to retrieve authentication token."
    );
  }

  return data.token;
}


async function getOptionalAccessToken(): Promise<
  string | null
> {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const {
      data: session,
    } =
      await authClient.getSession();

    if (!session?.user) {
      return null;
    }

    const {
      data,
      error,
    } =
      await authClient.token();

    if (
      error ||
      !data?.token
    ) {
      return null;
    }

    return data.token;
  } catch {
    return null;
  }
}

async function getAuthHeaders(): Promise<
  Record<string, string>
> {
  const headers: Record<
    string,
    string
  > = {
    "Content-Type":
      "application/json",
  };

  const token =
    await getOptionalAccessToken();

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
}

async function requestEnvelope<T>(
  endpoint: string,
  method: ApiMethod = "GET",
  body?: unknown,
  queryString?: string
): Promise<ApiEnvelope<T>> {
  const url =
    new URL(
      `${BASE_URL}${normalizeEndpoint(
        endpoint
      )}`
    );

  if (queryString) {
    const params =
      new URLSearchParams(
        queryString
      );

    params.forEach(
      (
        value,
        key
      ) => {
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
    response =
      await fetch(
        url.toString(),
        {
          method,

          headers,

          cache:
            "no-store",

          credentials:
            "include",

          ...(body !==
          undefined
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
      (await response.json()) as ApiEnvelope<T>;
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

export {
  BASE_URL,
};