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
  userName?: string;
  content?: string;
  message?: string;
};

type NotificationCollectionResponse = Exclude<CollectionResponse<NotificationRecord>, NotificationRecord[]> & {
  currentPage?: number;
  number?: number;
  pageSize?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  first?: boolean;
  last?: boolean;
};

export type NotificationPage = {
  notifications: NotificationRecord[];
  currentPage: number;
  totalPages?: number;
  totalElements?: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export async function getNotifications(page = 0, size = 10) {
  const result = await apiRequest<NotificationRecord[] | NotificationCollectionResponse>(`/api/v1/notifications?page=${page}&size=${size}`);
  const notifications = collectionItems(result);
  const metadata = Array.isArray(result) ? undefined : result as NotificationCollectionResponse;
  const currentPage = metadata?.currentPage ?? metadata?.number ?? page;
  const hasNext = metadata?.hasNext ?? (metadata?.last === undefined ? notifications.length === size : !metadata.last);
  const hasPrevious = metadata?.hasPrevious ?? (metadata?.first === undefined ? currentPage > 0 : !metadata.first);
  return {
    notifications,
    currentPage,
    totalPages: metadata?.totalPages,
    totalElements: metadata?.totalElements,
    hasNext,
    hasPrevious,
  } satisfies NotificationPage;
}
