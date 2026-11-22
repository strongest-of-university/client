import { apiRequest } from "../api/client";

export type InventoryApiItem = "COUPLE_TSHIRT" | "GINSENG" | "GOLF_BALL" | "SCARF";

export type InventoryResponse = {
  item: InventoryApiItem;
  itemName: string;
  quantity: number;
  updatedAt?: string;
};

export type InventoryChangeType = "INBOUND" | "OUTBOUND" | "ADJUSTMENT";

export type InventoryHistoryResponse = {
  historyId: number;
  item: InventoryApiItem;
  itemName: string;
  changeQuantity: number;
  quantityAfter: number;
  changeType: InventoryChangeType;
  reason: string;
  changedBy: string | null;
  createdAt: string;
};

export type InventoryHistoryPageResponse = {
  histories: InventoryHistoryResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export function getInventory() {
  return apiRequest<InventoryResponse[]>("/api/v1/inventory");
}

export function changeInventory(
  item: InventoryApiItem,
  changeQuantity: number,
  reason: string,
) {
  return apiRequest<InventoryResponse>(`/api/v1/inventory/${item}`, {
    method: "PATCH",
    body: JSON.stringify({
      changeType: changeQuantity > 0 ? "INBOUND" : "OUTBOUND",
      quantity: Math.abs(changeQuantity),
      reason,
    }),
  });
}

export function getInventoryHistory(page = 0) {
  return apiRequest<InventoryHistoryPageResponse>(`/api/v1/inventory/history?page=${page}`);
}
