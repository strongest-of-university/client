import type { TravelProductStatus } from "../../services/travelProductService";

export const STAFF_PRODUCT_STATUS_COLOR: Record<TravelProductStatus, string> = {
  RECRUITING: "#2f8064",
  CONFIRMED: "#38546c",
  CLOSED: "#7a6048",
  IN_PROGRESS: "#b05d18",
  COMPLETED: "#68625c",
  CANCELLED: "#9a3d2b",
};
