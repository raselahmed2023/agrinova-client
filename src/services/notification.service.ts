import { apiRequest } from "./api.client";
import type { AppNotification, NotificationInbox } from "@/types/notification";

export const getMyNotifications = (limit = 30) =>
  apiRequest<NotificationInbox>("/notifications", "GET", undefined, `limit=${limit}`);

export const markNotificationRead = (notificationId: string) =>
  apiRequest<AppNotification>(`/notifications/${notificationId}/read`, "PATCH");

export const markAllNotificationsRead = () =>
  apiRequest<boolean>("/notifications/read-all", "PATCH");