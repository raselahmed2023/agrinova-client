import {
  apiRequest,
  apiRequestWithMeta,
} from "./api.client";

import type {
  ICreateOrderPayload,
  IOrder,
  ISellerOrder,
  IStripeSession,
} from "@/types/marketplace";

export interface OrderPageResponse {
  data: IOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getCheckoutConfig = () =>
  apiRequest<{
    deliveryFee: number;
  }>("/orders/config");

export const createOrder = (
  payload: ICreateOrderPayload
) =>
  apiRequest<IOrder>(
    "/orders",
    "POST",
    payload
  );

export async function getMyOrdersPage(
  page = 1,
  limit = 10
): Promise<OrderPageResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const result = await apiRequestWithMeta<IOrder[]>(
    "/orders/my",
    "GET",
    undefined,
    query.toString()
  );

  const data = Array.isArray(result.data) ? result.data : [];

  return {
    data,
    meta: {
      page: Number(result.meta?.page || page),
      limit: Number(result.meta?.limit || limit),
      total: Number(result.meta?.total ?? data.length),
      totalPages: Math.max(Number(result.meta?.totalPages || 1), 1),
    },
  };
}

export const getMyOrders = async () =>
  (await getMyOrdersPage(1, 50)).data;

export const getMyOrderById = (
  orderId: string
) =>
  apiRequest<IOrder>(
    `/orders/my/${encodeURIComponent(orderId)}`
  );

export const getSellerOrders = () =>
  apiRequest<ISellerOrder[]>(
    "/orders/seller"
  );

export const updateSellerFulfillment = (
  orderId: string,
  status:
    | "confirmed"
    | "processing"
    | "ready_for_pickup"
) =>
  apiRequest<ISellerOrder>(
    `/orders/seller/${encodeURIComponent(orderId)}/fulfillment`,
    "PATCH",
    { status }
  );

export const createStripeCheckoutSession = (
  orderId: string
) =>
  apiRequest<IStripeSession>(
    "/payments/stripe/checkout-session",
    "POST",
    { orderId }
  );

export const getStripeCheckoutSession = (
  sessionId: string
) =>
  apiRequest<{
    sessionId: string;
    paymentStatus: string;
    status: string | null;
    orderId: string;
    orderNumber: string;
    orderPaymentStatus: string;
  }>(
    `/payments/stripe/session/${encodeURIComponent(sessionId)}`
  );

export const getStripePaymentStatus = (
  orderId: string
) =>
  apiRequest<{
    orderId: string;
    orderNumber: string;
    paymentStatus: string;
    paymentReference?: string;
  }>(
    `/payments/stripe/status/${encodeURIComponent(orderId)}`
  );

export const cancelStripeOrder = (
  orderId: string
) =>
  apiRequest<IOrder>(
    `/payments/stripe/cancel/${encodeURIComponent(orderId)}`,
    "POST"
  );

export const OrderService = {
  getCheckoutConfig,
  createOrder,
  getMyOrders,
  getMyOrdersPage,
  getMyOrderById,
  getSellerOrders,
  updateSellerFulfillment,
  createStripeCheckoutSession,
  getStripeCheckoutSession,
  getStripePaymentStatus,
  cancelStripeOrder,
};