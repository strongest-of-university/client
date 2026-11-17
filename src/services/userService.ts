import { apiRequest } from "../api/client";

export type UserRole = "CUSTOMER" | "STAFF";

export type UserProfile = {
  name: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  completedTripCount?: number;
};

export function getMyProfile() {
  return apiRequest<UserProfile>("/api/v1/user/me", { cache: "no-store" });
}

export function updateMyProfile(payload: Pick<UserProfile, "name" | "phoneNumber" | "address">) {
  return apiRequest<UserProfile>("/api/v1/user/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
