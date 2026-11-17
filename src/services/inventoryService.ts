import { apiRequest } from "../api/client";

export type InventoryApiItem = "COUPLE_TSHIRT" | "GINSENG" | "GOLF_BALL" | "SCARF";

export type InventoryResponse = {
  item: InventoryApiItem;
  itemName: string;
  quantity: number;
  updatedAt?: string;
};

export function getInventory() {
  return apiRequest<InventoryResponse[]>("/api/v1/inventory");
}

export function changeInventory(item: InventoryApiItem, quantity: number, reason: string) {
  return apiRequest<InventoryResponse>(`/api/v1/inventory/${item}`, {
    method: "PATCH",
    body: JSON.stringify({
      changeType: quantity >= 0 ? "INBOUND" : "OUTBOUND",
      quantity: Math.abs(quantity),
      reason,
    }),
  });
}
