export type InventoryId = "couple-shirt" | "ginseng" | "golf-ball" | "scarf" | "champagne" | "coffee";

export type InventoryItem = {
  id: InventoryId;
  name: string;
  description: string;
  amount: number;
  unit: string;
  safeStock: number;
  needed: string;
};

export type Inventory = Record<InventoryId, InventoryItem>;

export const defaultInventory: Inventory = {
  "couple-shirt": { id: "couple-shirt", name: "커플 기념티", description: "허니문 낭만 투어 기념품", amount: 24, unit: "벌", safeStock: 10, needed: "2벌" },
  ginseng: { id: "ginseng", name: "건강 인삼", description: "효도 힐링 투어 기념품", amount: 6, unit: "박스", safeStock: 10, needed: "2박스" },
  "golf-ball": { id: "golf-ball", name: "골프공", description: "골프 챌린지 투어 기념품", amount: 120, unit: "개", safeStock: 40, needed: "5개" },
  scarf: { id: "scarf", name: "아웃도어 스카프", description: "아웃도어 트레킹 투어 기념품", amount: 35, unit: "장", safeStock: 15, needed: "5장" },
  champagne: { id: "champagne", name: "샴페인", description: "추가 옵션", amount: 18, unit: "병", safeStock: 12, needed: "옵션 선택 시 차감" },
  coffee: { id: "coffee", name: "커피", description: "추가 옵션", amount: 60, unit: "잔", safeStock: 20, needed: "옵션 선택 시 차감" },
};

const STORAGE_KEY = "staffInventory";

export function loadInventory(): Inventory {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultInventory, ...JSON.parse(stored) } : defaultInventory;
  } catch {
    return defaultInventory;
  }
}

export function saveInventory(inventory: Inventory) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}
