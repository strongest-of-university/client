import { useEffect, useState, type FormEvent } from "react";
import { FiCalendar, FiCoffee, FiCreditCard, FiDroplet, FiGift, FiHome, FiStar, FiTruck, FiUsers, FiChevronDown } from "react-icons/fi";
import { getErrorMessage } from "../../api/client";
import { cancelBooking, getBooking, getMyBookingPage, type BookingDto } from "../../services/bookingService";
import { getMyProfile, updateMyProfile, type UserProfile } from "../../services/userService";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import * as S from "./MyPage.styles";

type Reservation = {
  bookingId: number;
  year: string;
  date: string;
  status: string;
  reservationNumber: string;
  title: string;
  summary: string;
  option: string;
  details: {
    period: string;
    people: string;
    grade: string;
    hotel: string;
    transport: string;
    meal: string;
    drink: string;
    gift: string;
    payment: string;
  };
  cancelState?: "available" | "unavailable";
  paymentAmount?: number;
  cancellationFee?: number;
  refundAmount?: number;
  bookingStatus: string;
  cancelled: boolean;
};

export default function MyPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextBookingPage, setNextBookingPage] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [cancelledReservations, setCancelledReservations] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: "", phoneNumber: "", address: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"history" | "profile">("history");
  const cancelAmount = cancelTarget?.paymentAmount;
  const cancellationFee = cancelTarget?.cancellationFee;
  const refundAmount = cancelTarget?.refundAmount;
  const reservationGroups = groupReservationsByYear(reservations);

  useEffect(() => {
    let active = true;
    getMyBookingPage()
      .then(async (page) => {
        const detailedBookings = await loadBookingDetails(page.bookings);
        if (active) {
          setReservations(detailedBookings.map(toReservation));
          setNextBookingPage(page.hasNext ? page.currentPage + 1 : null);
        }
      })
      .catch((error) => {
        if (active) setMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function loadMoreBookings() {
    if (nextBookingPage === null || loadingMore) return;
    setLoadingMore(true);
    setMessage("");
    try {
      const page = await getMyBookingPage(nextBookingPage);
      const detailedBookings = await loadBookingDetails(page.bookings);
      setReservations((current) => {
        const knownIds = new Set(current.map((reservation) => reservation.bookingId));
        return [...current, ...detailedBookings.filter((booking) => !knownIds.has(booking.bookingId)).map(toReservation)];
      });
      setNextBookingPage(page.hasNext ? page.currentPage + 1 : null);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((data) => { if (active) setProfile(data); })
      .catch((error) => { if (active) setMessage(getErrorMessage(error)); });
    return () => { active = false; };
  }, []);

  function openProfileEditor() {
    if (!profile) return;
    setProfileDraft({ name: profile.name, phoneNumber: profile.phoneNumber, address: profile.address });
    setProfileMessage("");
    setProfileOpen(true);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = profileDraft.name.trim();
    const phoneNumber = profileDraft.phoneNumber.trim();
    const address = profileDraft.address.trim();
    if (!name || !address) {
      setProfileMessage("이름과 주소를 모두 입력해 주세요.");
      return;
    }
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phoneNumber)) {
      setProfileMessage("휴대폰 번호를 확인해 주세요. 예: 010-1234-5678");
      return;
    }
    setProfileSaving(true);
    setProfileMessage("");
    try {
      const updated = await updateMyProfile({ name, phoneNumber, address });
      setProfile(updated);
      setProfileOpen(false);
      setMessage("회원 정보가 수정되었습니다.");
    } catch (error) {
      setProfileMessage(getErrorMessage(error));
    } finally {
      setProfileSaving(false);
    }
  }

  async function confirmCancellation() {
    if (!cancelTarget || cancelTarget.cancelState !== "available") return;
    setCancelling(true);
    try {
      const cancelled = await cancelBooking(cancelTarget.bookingId);
      setReservations((current) => current.map((reservation) =>
        reservation.bookingId === cancelTarget.bookingId ? toReservation(cancelled) : reservation,
      ));
      setCancelledReservations((current) => [...current, cancelTarget.reservationNumber]);
      setMessage(`${cancelTarget.title} 예약이 취소되었습니다.`);
      setCancelTarget(null);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setCancelling(false);
    }
  }

  function toggleDetails(reservation: Reservation) {
    setExpandedReservation((current) => current === reservation.reservationNumber ? null : reservation.reservationNumber);
  }

  return (
    <S.Page>
      <Header currentPage="mypage" />
      <S.Main>
        <S.TitleRow>
          <S.Title>마이페이지</S.Title>
        </S.TitleRow>
        <S.MyPageTabs role="tablist" aria-label="마이페이지 메뉴">
          <S.MyPageTab
            type="button"
            role="tab"
            aria-selected={activeSection === "history"}
            $active={activeSection === "history"}
            onClick={() => setActiveSection("history")}
          >
            여행 내역
          </S.MyPageTab>
          <S.MyPageTab
            type="button"
            role="tab"
            aria-selected={activeSection === "profile"}
            $active={activeSection === "profile"}
            onClick={() => setActiveSection("profile")}
          >
            회원 정보
          </S.MyPageTab>
        </S.MyPageTabs>

        {activeSection === "profile" && (
          <>
            {profile ? (
              <S.ProfileCard>
                <div><span>이름</span><strong>{profile.name}</strong></div>
                <div><span>휴대폰 번호</span><strong>{profile.phoneNumber}</strong></div>
                <div><span>주소</span><strong>{profile.address}</strong></div>
              </S.ProfileCard>
            ) : <S.LiveMessage role="status">회원 정보를 불러오는 중입니다.</S.LiveMessage>}
            <S.ProfileEditButton type="button" onClick={openProfileEditor} disabled={!profile}>정보 수정하기</S.ProfileEditButton>
            <S.LiveMessage role="status" aria-live="polite">{message}</S.LiveMessage>
          </>
        )}

        {activeSection === "history" && <>
        {loading && <S.LiveMessage role="status">예약 내역을 불러오는 중입니다.</S.LiveMessage>}
        {!loading && reservations.length === 0 && !message && <S.LiveMessage role="status">예약 내역이 없습니다.</S.LiveMessage>}
        {reservationGroups.map(([year, yearReservations]) => (
        <section key={year}>
        <S.Year>{year === "일정 미정" ? year : `${year}년`}</S.Year>
        <S.Timeline>
          {yearReservations.map((reservation) => {
            const detailOpen = expandedReservation === reservation.reservationNumber;
            const detailId = `reservation-detail-${reservation.reservationNumber}`;
            const cancelled = reservation.cancelled || cancelledReservations.includes(reservation.reservationNumber);

            return (
            <S.TimelineItem key={reservation.reservationNumber}>
              <S.Date>{reservation.date}</S.Date>
              <S.Card>
                <S.StatusRow>
                  <S.Status>{cancelled ? "예약 취소" : reservation.status}</S.Status>
                  <S.ReservationNumber>
                    {reservation.reservationNumber}
                  </S.ReservationNumber>
                </S.StatusRow>
                <S.TourTitle>{reservation.title}</S.TourTitle>
                <S.Summary>{reservation.summary}</S.Summary>
                <S.OptionButton
                  type="button"
                  $open={detailOpen}
                  onClick={() => void toggleDetails(reservation)}
                  aria-expanded={detailOpen}
                  aria-controls={detailId}
                >
                  <span>{reservation.option}</span>
                  <FiChevronDown aria-hidden="true" />
                </S.OptionButton>
                <S.DetailPanel id={detailId} $open={detailOpen} aria-hidden={!detailOpen}>
                  <S.DetailInner>
                    <S.DetailTitle>예약 상세 정보</S.DetailTitle>
                    <S.DetailList>
                      <div><dt><FiCalendar aria-hidden="true" /><span>여행 일정</span></dt><dd>{reservation.details.period}</dd></div>
                      <div><dt><FiUsers aria-hidden="true" /><span>신청 인원</span></dt><dd>{reservation.details.people}</dd></div>
                      <div><dt><FiStar aria-hidden="true" /><span>여행 등급</span></dt><dd>{reservation.details.grade}</dd></div>
                      <div><dt><FiHome aria-hidden="true" /><span>호텔</span></dt><dd>{reservation.details.hotel}</dd></div>
                      <div><dt><FiTruck aria-hidden="true" /><span>교통</span></dt><dd>{reservation.details.transport}</dd></div>
                      <div><dt><FiCoffee aria-hidden="true" /><span>식사</span></dt><dd>{reservation.details.meal}</dd></div>
                      <div><dt><FiDroplet aria-hidden="true" /><span>추가 음료</span></dt><dd>{reservation.details.drink}</dd></div>
                      <div><dt><FiGift aria-hidden="true" /><span>기념품</span></dt><dd>{reservation.details.gift}</dd></div>
                      <div><dt><FiCreditCard aria-hidden="true" /><span>결제 금액</span></dt><dd>{reservation.details.payment}</dd></div>
                    </S.DetailList>
                  </S.DetailInner>
                </S.DetailPanel>

                {reservation.cancelState === "available" && !cancelled && (
                  <S.CancelButton
                    type="button"
                    onClick={() => setCancelTarget(reservation)}
                  >
                    예약 취소
                  </S.CancelButton>
                )}
                {cancelled && (
                  <>
                    <S.CancelButton type="button" disabled>예약 취소 완료</S.CancelButton>
                    <S.Note>취소 금액은 결제 수단에 따라 순차적으로 환불됩니다.</S.Note>
                  </>
                )}
                {reservation.cancelState === "unavailable" && (
                  <>
                    <S.CancelButton type="button" disabled>
                      예약 취소 불가
                    </S.CancelButton>
                    <S.Note>{cancellationUnavailableMessage(reservation)}</S.Note>
                  </>
                )}
              </S.Card>
            </S.TimelineItem>
            );
          })}
        </S.Timeline>
        </section>
        ))}
        {nextBookingPage !== null && (
          <S.MoreReservationsButton type="button" onClick={() => void loadMoreBookings()} disabled={loadingMore}>
            {loadingMore ? "예약 내역 불러오는 중..." : "예약 내역 더보기"}
          </S.MoreReservationsButton>
        )}
        <S.LiveMessage role="status" aria-live="polite">
          {message}
        </S.LiveMessage>
        </>}
      </S.Main>
      <Modal
        open={profileOpen}
        title="회원 정보 수정"
        onClose={() => !profileSaving && setProfileOpen(false)}
        tone="warm"
      >
        <S.ProfileForm onSubmit={(event) => void saveProfile(event)}>
          <S.ProfileField>
            <label htmlFor="profile-name">이름</label>
            <input id="profile-name" value={profileDraft.name} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} autoComplete="name" required />
          </S.ProfileField>
          <S.ProfileField>
            <label htmlFor="profile-phone">휴대폰 번호</label>
            <input id="profile-phone" value={profileDraft.phoneNumber} onChange={(event) => setProfileDraft((current) => ({ ...current, phoneNumber: event.target.value }))} autoComplete="tel" inputMode="tel" placeholder="010-1234-5678" required />
          </S.ProfileField>
          <S.ProfileField>
            <label htmlFor="profile-address">주소</label>
            <input id="profile-address" value={profileDraft.address} onChange={(event) => setProfileDraft((current) => ({ ...current, address: event.target.value }))} autoComplete="street-address" required />
          </S.ProfileField>
          <S.ProfileFormMessage role="alert" aria-live="polite">{profileMessage}</S.ProfileFormMessage>
          <S.ProfileActions>
            <S.BackButton type="button" onClick={() => setProfileOpen(false)} disabled={profileSaving}>돌아가기</S.BackButton>
            <S.SaveProfileButton type="submit" disabled={profileSaving}>{profileSaving ? "저장 중..." : "저장하기"}</S.SaveProfileButton>
          </S.ProfileActions>
        </S.ProfileForm>
      </Modal>
      <Modal
        open={cancelTarget !== null}
        title="예약을 취소할까요?"
        onClose={() => setCancelTarget(null)}
        size="large"
        tone="warm"
      >
        {cancelTarget && (
          <>
            <S.CancelSummary>
              {cancelTarget.title} · {cancelTarget.details.period} · {cancelTarget.details.grade} · {cancelTarget.details.people} · {cancelTarget.details.payment}
            </S.CancelSummary>
            <S.RefundBox>
              <div><span>결제 금액</span><strong>{formatPaymentAmount(cancelAmount)}</strong></div>
              <div><span>취소 수수료</span><strong className="fee">{formatCancellationFee(cancellationFee)}</strong></div>
              <div className="refund"><span>환불 예정</span><strong>{formatPaymentAmount(refundAmount)}</strong></div>
            </S.RefundBox>
            <S.CancellationRule>{cancellationPolicyMessage(cancelTarget)}</S.CancellationRule>
            <S.CancelActions>
              <S.BackButton type="button" onClick={() => setCancelTarget(null)}>돌아가기</S.BackButton>
              <S.ConfirmCancelButton type="button" onClick={() => void confirmCancellation()} disabled={cancelling}>{cancelling ? "취소 중..." : "취소하기"}</S.ConfirmCancelButton>
            </S.CancelActions>
          </>
        )}
      </Modal>
    </S.Page>
  );
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_CONFIRMATION: "모집 중",
  CONFIRMED: "출발 확정",
  IN_PROGRESS: "여행 진행 중",
  CANCELLED: "예약 취소",
  COMPLETED: "여행 완료",
};

const LEVEL_LABEL: Record<string, string> = { CLASSIC: "클래식", GRAND: "그랜드", PREMIUM: "프리미엄" };
const MEAL_LABEL: Record<number, string> = { 1: "도시락", 2: "현지식 레스토랑", 3: "스테이크" };
const DRINK_LABEL: Record<number, string> = { 0: "없음", 1: "샴페인", 2: "커피", 3: "샴페인과 커피" };
const TRANSPORT_LABEL: Record<number, string> = { 1: "2인 고급차량", 2: "10인 승합 고급차량" };
const GIFT_LABEL: Record<string, string> = { HONEYMOON: "커플 기념티", HEALING: "건강 인삼", GOLF: "골프공", TREKKING: "아웃도어 스카프" };

function formatDate(value?: string, includeYear = false) {
  if (!value) return "일정 미정";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    ...(includeYear ? { year: "numeric" as const } : {}),
    month: "2-digit",
    day: "2-digit",
    weekday: includeYear ? undefined : "short",
  }).format(date);
}

function productName(booking: BookingDto) {
  if (typeof booking.travelProduct === "string") return booking.travelProduct;
  return booking.travelProduct?.name ?? booking.travelProduct?.title ?? booking.travelProductName ?? GIFT_THEME_TITLE[booking.theme ?? ""] ?? "테마 여행";
}

const GIFT_THEME_TITLE: Record<string, string> = { HONEYMOON: "허니문 낭만 투어", HEALING: "효도 힐링 투어", GOLF: "골프 챌린지 투어", TREKKING: "아웃도어 트레킹 투어" };

function toReservation(booking: BookingDto): Reservation {
  const title = productName(booking);
  const people = booking.numberOfPeople ?? 0;
  const price = booking.totalPrice;
  const payment = formatPaymentAmount(price);
  const grade = LEVEL_LABEL[booking.tourLevel ?? ""] ?? booking.tourLevel ?? "등급 미정";
  const hotel = booking.selectedHotel ? `${booking.selectedHotel}성급 호텔` : "호텔 미정";
  const transport = TRANSPORT_LABEL[booking.selectedTransportation ?? 0] ?? "교통 미정";
  const meal = MEAL_LABEL[booking.selectedMeal ?? 0] ?? "식사 미정";
  const drink = DRINK_LABEL[booking.selectedDrink ?? 0] ?? "음료 미정";
  const optionDrink = (booking.selectedDrink ?? 0) > 0 ? ` / ${drink}` : "";
  const theme = booking.theme ?? (typeof booking.travelProduct === "object" ? booking.travelProduct?.theme : undefined) ?? "";
  const status = STATUS_LABEL[booking.bookingStatus] ?? booking.bookingStatus;
  const cancelled = booking.bookingStatus === "CANCELLED";
  const statusAllowsCancellation = booking.bookingStatus !== "IN_PROGRESS" && booking.bookingStatus !== "COMPLETED";
  const cancellable = statusAllowsCancellation && booking.cancellable === true;
  return {
    bookingId: booking.bookingId,
    year: booking.departureDate?.slice(0, 4) || "일정 미정",
    date: formatDate(booking.departureDate),
    status,
    reservationNumber: `MW-${String(booking.bookingId).padStart(6, "0")}`,
    title,
    summary: `${formatDate(booking.departureDate)} – ${formatDate(booking.returnDate)} · ${people}명 · ${payment}`,
    option: `${grade} / ${hotel} / ${meal}${optionDrink}`,
    details: {
      period: `${formatDate(booking.departureDate, true)} – ${formatDate(booking.returnDate, true)}`,
      people: `${people}명`,
      grade,
      hotel,
      transport,
      meal,
      drink,
      gift: GIFT_LABEL[theme] ?? "기념품 미정",
      payment,
    },
    cancelState: cancelled ? undefined : cancellable ? "available" : "unavailable",
    paymentAmount: price,
    cancellationFee: booking.cancellationFee,
    refundAmount: booking.refundAmount,
    bookingStatus: booking.bookingStatus,
    cancelled,
  };
}

function groupReservationsByYear(reservations: Reservation[]) {
  const groups = new Map<string, Reservation[]>();
  reservations.forEach((reservation) => {
    const items = groups.get(reservation.year) ?? [];
    items.push(reservation);
    groups.set(reservation.year, items);
  });
  return [...groups.entries()].sort(([yearA], [yearB]) => {
    if (yearA === "일정 미정") return 1;
    if (yearB === "일정 미정") return -1;
    return yearB.localeCompare(yearA);
  });
}

function formatPaymentAmount(value?: number) {
  return value === undefined ? "결제 금액 정보 없음" : `${value.toLocaleString("ko-KR")}원`;
}

function formatCancellationFee(value?: number) {
  if (value === undefined) return "정보 없음";
  if (value === 0) return "0원";
  return `−${value.toLocaleString("ko-KR")}원`;
}

function cancellationPolicyMessage(reservation: Reservation) {
  if (reservation.bookingStatus === "PENDING_CONFIRMATION") {
    return "출발 확정 전 예약은 취소 수수료 없이 결제 금액 전액이 환불됩니다.";
  }
  if (reservation.bookingStatus === "CONFIRMED") {
    return "출발 확정 예약은 출발 7일 전까지 취소할 수 있으며, 서버에서 계산한 취소 수수료를 제외한 금액이 환불됩니다.";
  }
  return "취소 수수료와 환불 예정 금액은 서버의 예약 상태와 취소 정책에 따라 계산됩니다.";
}

function cancellationUnavailableMessage(reservation: Reservation) {
  if (reservation.bookingStatus === "IN_PROGRESS") return "여행이 진행 중이라 예약을 취소할 수 없어요.";
  if (reservation.bookingStatus === "COMPLETED") return "여행이 완료되어 예약을 취소할 수 없어요.";
  return "현재 예약 상태에서는 취소할 수 없어요.";
}

async function loadBookingDetails(bookings: BookingDto[]) {
  return Promise.all(bookings.map(async (booking) => {
    try {
      const detail = await getBooking(booking.bookingId);
      return { ...booking, ...detail, cancellable: booking.cancellable };
    } catch {
      return booking;
    }
  }));
}
