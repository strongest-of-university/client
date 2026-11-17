import { apiRequest } from "../api/client";
import type { ThemeCode } from "./travelProductService";

export type BookingStatus = "PENDING_CONFIRMATION" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;

export type BookingDto = {
  bookingId: number;
  bookingStatus: BookingStatus;
  cancellable?: boolean;
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

export async function getMyBookings() {
  const result = await apiRequest<BookingPageResponse | BookingDto[]>("/api/v1/bookings/me/history");
  return Array.isArray(result) ? result : result.bookings ?? result.content ?? [];
}

export function getBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/${bookingId}`);
}

export function cancelBooking(bookingId: number) {
  return apiRequest<BookingDto>(`/api/v1/bookings/cancel/${bookingId}`, { method: "PATCH" });
}

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
  return {
    ...preview,
    ...response,
    bookingId: response.bookingId,
    bookingStatus: response.bookingStatus ?? "PENDING_CONFIRMATION",
  } satisfies BookingDto;
}

export function getTravelProductBookings(travelProductId: number, page = 0) {
  return apiRequest<TravelProductBookingPage>(`/api/v1/travel-products/${travelProductId}/bookings?page=${page}`);
}
