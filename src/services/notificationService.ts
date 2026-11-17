import { apiRequest } from "../api/client";
import { collectionItems, type CollectionResponse } from "./collectionResponse";

export type NotificationRecord = {
  notificationId?: number;
  createdAt?: string;
  sentAt?: string;
  type?: string;
  notificationType?: string;
  recipients?: string;
  recipientName?: string;
  content?: string;
  message?: string;
};

export async function getNotifications(page = 0, size = 10) {
  const result = await apiRequest<CollectionResponse<NotificationRecord>>(`/api/v1/notifications?page=${page}&size=${size}`);
  return collectionItems(result);
}
