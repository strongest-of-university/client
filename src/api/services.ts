import { apiRequest } from "./client";

export type UserRole = "CUSTOMER" | "STAFF";

export type UserProfile = {
  name: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  completedTripCount?: number;
};

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

export function login(loginId: string, password: string) {
  return apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  });
}

export function signup(payload: { loginId: string; password: string; name: string; phoneNumber: string; address: string }) {
  return apiRequest<unknown>("/api/v1/auth/customer/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyProfile() {
  return apiRequest<UserProfile>("/api/v1/user/me");
}

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

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | string;

export type BookingDto = {
  bookingId: number;
  status: BookingStatus;
  bookedAt?: string;
  travelProduct?: { id?: number; name?: string; title?: string; theme?: string } | string;
  travelProductName?: string;
  theme?: string;
  departureDate?: string;
  returnDate?: string;
  tourLevel?: "CLASSIC" | "GRAND" | "PREMIUM" | string;
  numberOfPeople?: number;
  selectedHotel?: number;
  selectedTransportation?: number;
  selectedMeal?: number;
  selectedDrink?: number;
  totalPrice?: number;
  cancellationFee?: number;
  refundAmount?: number;
  paymentStatus?: string;
};

export type BookingPageResponse = {
  bookings?: BookingDto[];
  content?: BookingDto[];
};

export async function getMyBookings() {
  const result = await apiRequest<BookingPageResponse | BookingDto[]>("/api/v1/bookings/me?page=0");
  if (Array.isArray(result)) return result;
  return result.bookings ?? result.content ?? [];
}

export function getBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/${bookingId}`);
}

export function cancelBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/cancel/${bookingId}`, { method: "PATCH" });
}
