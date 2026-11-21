import { apiRequest } from "../api/client";
import { collectionItems, type CollectionResponse } from "./collectionResponse";

export type ThemeCode = "GOLF" | "HONEYMOON" | "HEALING" | "TREKKING";
export type TravelProductStatus = "RECRUITING" | "CONFIRMED" | "CLOSED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export function minimumApplicantsForTheme(theme: ThemeCode) {
  return theme === "HONEYMOON" ? 4 : 3;
}

export type TravelProduct = {
  travelProductId: number;
  departureDate: string;
  returnDate: string;
  currentParticipants: number;
  capacity: number;
  remainingCapacity: number;
  status: TravelProductStatus;
  theme?: ThemeCode;
  baseServicePrice?: number;
  flightPrice?: number;
  threeStarHotelPrice?: number;
  fourStarHotelPrice?: number;
  fiveStarHotelPrice?: number;
  lunchPrice?: number;
  localRestaurantPrice?: number;
  steakPrice?: number;
  luxuryCarPrice?: number;
  luxuryVanPrice?: number;
};

export type TravelProductCreateRequest = {
  theme: ThemeCode;
  departureDate: string;
  returnDate: string;
  baseServicePrice: number;
  flightPrice: number;
  threeStarHotelPrice: number;
  fourStarHotelPrice: number;
  fiveStarHotelPrice: number;
  lunchPrice: number;
  localRestaurantPrice: number;
  steakPrice: number;
  luxuryCarPrice: number;
  luxuryVanPrice: number;
  capacity: number;
  validTravelPeriod?: boolean;
};

export async function getTravelProducts(theme: ThemeCode) {
  const result = await apiRequest<CollectionResponse<TravelProduct>>(`/api/v1/travel-products?theme=${encodeURIComponent(theme)}`);
  return collectionItems(result).map((product) => ({ ...product, theme: product.theme ?? theme }));
}

export async function getStaffTravelProducts() {
  const result = await apiRequest<CollectionResponse<TravelProduct>>("/api/v1/travel-products/staff");
  return collectionItems(result).map((product) => {
    if (!product.theme) throw new Error("직원용 상품 응답에 테마 정보가 없습니다.");
    return { ...product, theme: product.theme } as TravelProduct & { theme: ThemeCode };
  });
}

export function getTravelProduct(travelProductId: number) {
  return apiRequest<TravelProduct>(`/api/v1/travel-products/${travelProductId}`);
}

export function createTravelProduct(payload: TravelProductCreateRequest) {
  return apiRequest<unknown>("/api/v1/travel-products", { method: "POST", body: JSON.stringify(payload) });
}

export function deleteTravelProduct(travelProductId: number) {
  return apiRequest<unknown>(`/api/v1/travel-products/${travelProductId}`, { method: "DELETE" });
}
