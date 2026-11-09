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

export function updateMyProfile(payload: Pick<UserProfile, "name" | "phoneNumber" | "address">) {
  return apiRequest<UserProfile>("/api/v1/user/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export type ThemeCode = "GOLF" | "HONEYMOON" | "HEALING" | "TREKKING";
export type TravelProductStatus = "RECRUITING" | "CONFIRMED" | "CLOSED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
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

type CollectionResponse<T> = T[] | { travelProducts?: T[]; products?: T[]; notifications?: T[]; content?: T[] };

function collectionItems<T>(response: CollectionResponse<T>) {
  if (Array.isArray(response)) return response;
  return response.travelProducts ?? response.products ?? response.notifications ?? response.content ?? [];
}

export async function getTravelProducts(theme: ThemeCode) {
  const result = await apiRequest<CollectionResponse<TravelProduct>>(`/api/v1/travel-products?theme=${theme}`);
  return collectionItems(result).map((product) => ({ ...product, theme: product.theme ?? theme }));
}

export function getTravelProduct(travelProductId: number) {
  return apiRequest<TravelProduct>(`/api/v1/travel-products/${travelProductId}`);
}

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

export function createTravelProduct(payload: TravelProductCreateRequest) {
  return apiRequest<unknown>("/api/v1/travel-products", { method: "POST", body: JSON.stringify(payload) });
}

export function deleteTravelProduct(travelProductId: number) {
  return apiRequest<unknown>(`/api/v1/travel-products/${travelProductId}`, { method: "DELETE" });
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

export type BookingStatus = "PENDING_CONFIRMATION" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;

export type BookingDto = {
  bookingId: number;
  bookingStatus: BookingStatus;
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
  travelProductId?: number;
};

export type BookingPageResponse = {
  bookings?: BookingDto[];
  content?: BookingDto[];
};

const LAST_CREATED_BOOKING_KEY = "lastCreatedBooking";

function readLastCreatedBooking() {
  try {
    const stored = window.sessionStorage.getItem(LAST_CREATED_BOOKING_KEY);
    return stored ? JSON.parse(stored) as BookingDto : null;
  } catch {
    return null;
  }
}

export async function getMyBookings() {
  const result = await apiRequest<BookingPageResponse | BookingDto[]>("/api/v1/bookings/me?page=0");
  const bookings = Array.isArray(result) ? result : result.bookings ?? result.content ?? [];
  const lastCreated = readLastCreatedBooking();
  if (!lastCreated?.bookingId) return bookings;
  if (bookings.some((booking) => booking.bookingId === lastCreated.bookingId)) {
    window.sessionStorage.removeItem(LAST_CREATED_BOOKING_KEY);
    return bookings;
  }
  return [lastCreated, ...bookings];
}

export function getBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/${bookingId}`);
}

export function cancelBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/cancel/${bookingId}`, { method: "PATCH" });
}

export type BookingSelection = {
  travelProductId: number;
  tourLevel: "CLASSIC" | "GRAND" | "PREMIUM";
  numberOfPeople: number;
  selectedHotel: number;
  selectedTransportation: number;
  selectedMeal: number;
  selectedDrink: number;
};

export type BookingPreview = BookingSelection & {
  theme: ThemeCode;
  departureDate: string;
  returnDate: string;
  baseServicePrice: number;
  flightPrice: number;
  hotelPrice: number;
  transportationPrice: number;
  mealPrice: number;
  drinkPrice: number;
  pricePerPerson: number;
  originalPrice: number;
  regularCustomer: boolean;
  discountAmount: number;
  totalPrice: number;
};

function bookingQuery(selection: BookingSelection) {
  const query = new URLSearchParams();
  Object.entries(selection).forEach(([key, value]) => query.set(key, String(value)));
  return query.toString();
}

export function previewBooking(selection: BookingSelection) {
  return apiRequest<BookingPreview>(`/api/v1/bookings/preview?${bookingQuery(selection)}`);
}

export async function createBooking(selection: BookingSelection, cardNumber: string, preview?: BookingPreview) {
  let response = await apiRequest<BookingDto | null>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({ ...selection, cardNumber }),
  });
  if (!response?.bookingId) {
    const bookings = await getMyBookings();
    response = bookings.find((booking) =>
      booking.travelProductId === selection.travelProductId
      && booking.numberOfPeople === selection.numberOfPeople
      && booking.bookingStatus !== "CANCELLED",
    ) ?? null;
  }
  if (!response?.bookingId) {
    throw new Error("예약 생성 결과를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  const booking: BookingDto = {
    ...preview,
    ...response,
    bookingId: response.bookingId,
    bookingStatus: response.bookingStatus ?? "PENDING_CONFIRMATION",
  };
  if (booking?.bookingId) {
    window.sessionStorage.setItem(LAST_CREATED_BOOKING_KEY, JSON.stringify(booking));
  }
  return booking;
}

export type TravelProductBooking = {
  bookingId: number;
  bookingStatus: BookingStatus;
  bookedAt: string;
  userId: number;
  userName: string;
  phoneNumber: string;
  tourLevel: "CLASSIC" | "GRAND" | "PREMIUM";
  numberOfPeople: number;
  paidAmount: number;
  paymentStatus: string;
};

export type TravelProductBookingPage = {
  bookings: TravelProductBooking[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
};

export function getTravelProductBookings(travelProductId: number, page = 0) {
  return apiRequest<TravelProductBookingPage>(`/api/v1/travel-products/${travelProductId}/bookings?page=${page}`);
}

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
