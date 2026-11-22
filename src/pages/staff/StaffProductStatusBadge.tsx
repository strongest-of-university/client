import styled from "styled-components";
import type { TravelProductStatus } from "../../services/travelProductService";
import { STAFF_PRODUCT_STATUS_COLOR } from "./StaffProductStatusColors";

const STATUS_LABEL: Record<TravelProductStatus, string> = {
  RECRUITING: "모집 중",
  CONFIRMED: "출발 확정",
  CLOSED: "마감",
  IN_PROGRESS: "여행 진행 중",
  COMPLETED: "여행 완료",
  CANCELLED: "판매 중지",
};

type StaffProductStatusProps = {
  status: TravelProductStatus;
};

export default function StaffProductStatus({ status }: StaffProductStatusProps) {
  const color = STAFF_PRODUCT_STATUS_COLOR[status] ?? "#68625c";
  const label = STATUS_LABEL[status] ?? status;
  return <Badge $color={color}>{label}</Badge>;
}

const Badge = styled.span<{ $color: string }>`
  display: flex;
  flex: none;
  align-items: center;
  gap: 5px;
  padding: 3px 0;
  color: ${({ $color }) => $color};
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  &::before {
    content: "";
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 10%, transparent);
  }
`;
