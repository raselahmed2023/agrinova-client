import { apiRequest } from "./api.client";

import type {
  ICreateOrderPayload,
  IOrder,
  IStripeSession,
} from "@/types/marketplace";

export async function createOrder(
  payload: ICreateOrderPayload
): Promise<IOrder> {
  return apiRequest<IOrder>(
    "/orders",
    "POST",
    payload
  );
}

export async function getMyOrders(): Promise<
  IOrder[]
> {
  return apiRequest<IOrder[]>(
    "/orders/my"
  );
}

export async function getMyOrderById(
  orderId: string
): Promise<IOrder> {
  return apiRequest<IOrder>(
    `/orders/my/${orderId}`
  );
}

export async function getSellerOrders(): Promise<
  IOrder[]
> {
  return apiRequest<IOrder[]>(
    "/orders/seller"
  );
}

export async function updateSellerFulfillment(
  orderId: string,
  status:
    | "confirmed"
    | "processing"
    | "ready_for_pickup"
): Promise<IOrder> {
  return apiRequest<IOrder>(
    `/orders/seller/${orderId}/fulfillment`,
    "PATCH",
    {
      status,
    }
  );
}

export async function createStripeCheckoutSession(
  orderId: string
): Promise<IStripeSession> {
  return apiRequest<IStripeSession>(
    "/payments/stripe/create-session",
    "POST",
    {
      orderId,
    }
  );
}

export async function getStripeCheckoutSession(
  sessionId: string
) {
  return apiRequest<{
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
}

export const OrderService = {
  createOrder,

  getMyOrders,

  getMyOrderById,

  getSellerOrders,

  updateSellerFulfillment,

  createStripeCheckoutSession,

  getStripeCheckoutSession,
};