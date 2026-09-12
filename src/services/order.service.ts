
import { apiRequest } from "./api.client";

import type {
  ICreateOrderPayload,
  IOrder,
  IStripeSession,
} from "@/types/marketplace";

export const createOrder = (
  payload: ICreateOrderPayload
) =>
  apiRequest<IOrder>(
    "/orders",
    "POST",
    payload
  );

export const getMyOrders = () =>
  apiRequest<IOrder[]>(
    "/orders/my"
  );

export const getMyOrderById = (
  orderId: string
) =>
  apiRequest<IOrder>(
    `/orders/my/${encodeURIComponent(
      orderId
    )}`
  );

export const getSellerOrders = () =>
  apiRequest<IOrder[]>(
    "/orders/seller"
  );

export const updateSellerFulfillment = (
  orderId: string,
  status:
    | "confirmed"
    | "processing"
    | "ready_for_pickup"
) =>
  apiRequest<IOrder>(
    `/orders/seller/${encodeURIComponent(
      orderId
    )}/fulfillment`,
    "PATCH",
    { status }
  );

export const createStripeCheckoutSession = (
  orderId: string
) =>
  apiRequest<IStripeSession>(
    "/payments/stripe/checkout-session",
    "POST",
    {
      orderId,
    }
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
    `/payments/stripe/session/${encodeURIComponent(
      sessionId
    )}`
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
    `/payments/stripe/status/${encodeURIComponent(
      orderId
    )}`
  );

export const cancelStripeOrder = (
  orderId: string
) =>
  apiRequest<IOrder>(
    `/payments/stripe/cancel/${encodeURIComponent(
      orderId
    )}`,
    "POST"
  );

export const OrderService = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getSellerOrders,
  updateSellerFulfillment,
  createStripeCheckoutSession,
  getStripeCheckoutSession,
  getStripePaymentStatus,
  cancelStripeOrder,
};