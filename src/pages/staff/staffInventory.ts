export type InventoryId = "couple-shirt" | "ginseng" | "golf-ball" | "scarf";

export type InventoryItem = {
  id: InventoryId;
  name: string;
  description: string;
  amount: number;
  unit: string;
};

export type Inventory = Record<InventoryId, InventoryItem>;

export const defaultInventory: Inventory = {
  "couple-shirt": { id: "couple-shirt", name: "커플 기념티", description: "허니문 낭만 투어 기념품", amount: 0, unit: "벌" },
  ginseng: { id: "ginseng", name: "건강 인삼", description: "효도 힐링 투어 기념품", amount: 0, unit: "박스" },
  "golf-ball": { id: "golf-ball", name: "골프공", description: "골프 챌린지 투어 기념품", amount: 0, unit: "개" },
  scarf: { id: "scarf", name: "아웃도어 스카프", description: "아웃도어 트레킹 투어 기념품", amount: 0, unit: "장" },
};
