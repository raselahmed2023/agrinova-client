export interface AppNotification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  readAt?: string;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationInbox {
  data: AppNotification[];
  unreadCount: number;
}