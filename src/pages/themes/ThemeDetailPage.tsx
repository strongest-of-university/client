import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { getTravelProduct, getTravelProducts, minimumApplicantsForTheme, type ThemeCode, type TravelProductStatus } from "../../services/travelProductService";
import { useAuth } from "../../contexts/auth/authContext";
import { useBookingDraft } from "../../contexts/booking/bookingDraftContext";
import * as S from "./ThemeDetailPage.styles";
import { themeLinks, type ThemeDetail } from "./themeDetails";

type Departure = {
  id: string;
  dates: string;
  duration: string;
  price: string;
  applicants: number;
  capacity: number;
  status: TravelProductStatus;
};

export default function ThemeDetailPage({ theme }: { theme: ThemeDetail }) {
  const { isAuthenticated } = useAuth();
  const { saveBookingDraft } = useBookingDraft();
  const { features } = theme;
  const otherThemes = themeLinks.filter((item) => item.id !== theme.id);
  const tourStyles = theme.tourStyles.filter((style) => !style.unavailable);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [message, setMessage] = useState("여행 상품을 불러오는 중입니다.");

  useEffect(() => {
    let active = true;
    getTravelProducts(theme.id.toUpperCase() as ThemeCode)
      .then((products) => Promise.all(products.map((product) => getTravelProduct(product.travelProductId).catch(() => product))))
      .then((products) => {
        if (!active) return;
        const availableProducts = products.filter(
          (product) => product.status === "RECRUITING" || product.status === "CONFIRMED",
        );
        setDepartures(availableProducts.map((product) => {
            const start = new Date(product.departureDate);
            const end = new Date(product.returnDate);
            const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
            return {
              id: String(product.travelProductId),
              dates: `${displayDate(start, true)} – ${displayDate(end)}`,
              duration: `${nights}박 ${nights + 1}일`,
              price: minimumProductPrice(product, theme.id)?.toLocaleString("ko-KR") ?? "가격 정보 없음",
              applicants: product.currentParticipants,
              capacity: product.capacity,
              status: product.status,
            };
          }));
        setMessage(availableProducts.length === 0 ? "현재 모집 중인 여행 상품이 없습니다." : "");
      })
      .catch((error) => {
        if (!active) return;
        setDepartures([]);
        setMessage(isAuthenticated ? getErrorMessage(error) : "로그인하면 모집 중인 여행 상품을 확인할 수 있습니다.");
      });
    return () => { active = false; };
  }, [theme, isAuthenticated]);

  function reserve(departureId: string) {
    setSelectedDeparture(departureId);
    saveBookingDraft(Number(departureId));
    window.location.assign(isAuthenticated ? "/booking" : "/reservation");
  }

  return (
    <S.Page>
      <Header />
      <main>
        <S.Hero
          aria-labelledby="theme-title"
          $image={theme.image}
          $position={theme.imagePosition}
          $mobilePosition={theme.mobileImagePosition}
        >
          <S.HeroContent>
            <S.Eyebrow>{theme.name}</S.Eyebrow>
            <S.Title id="theme-title">{theme.title}</S.Title>
            <S.HeroDescription>
              {theme.description}
            </S.HeroDescription>
          </S.HeroContent>
        </S.Hero>
        <S.Content>
          <S.Overview>
            <section aria-labelledby="about-title">
              <S.SectionTitle id="about-title" $compact>About</S.SectionTitle>
              <S.Introduction>
                {theme.introduction}
              </S.Introduction>
              <S.FeatureList>
                {features.map(([label, description]) => (
                  <S.Feature key={label}>
                    <dt>{label}</dt>
                    <dd>{description}</dd>
                  </S.Feature>
                ))}
              </S.FeatureList>
              {theme.restriction && <S.Restriction>{theme.restriction}</S.Restriction>}
            </section>
            <S.DeparturesSection id="departures" aria-labelledby="departures-title">
              <S.SectionTitle id="departures-title" $compact>Departures</S.SectionTitle>
              <S.DepartureList>
                {departures.map((departure) => (
                  <S.DepartureCard key={departure.id} aria-labelledby={`departure-${departure.id}`}>
                    <S.CardHeading>
                      <S.DepartureTitle id={`departure-${departure.id}`}>{departure.dates}</S.DepartureTitle>
                      <S.Badge $confirmed={departure.status === "CONFIRMED"}>
                        {PRODUCT_STATUS_LABEL[departure.status]}
                      </S.Badge>
                    </S.CardHeading>
                    <S.DetailRow>
                      <span>{departure.duration}</span>
                      <strong>{departure.price === "가격 정보 없음" ? departure.price : `1인 ${departure.price}원부터`}</strong>
                    </S.DetailRow>
                    <S.CapacityRow>
                      <span>신청 인원 (최소 {minimumApplicantsForTheme(theme.id.toUpperCase() as ThemeCode)}명)</span>
                      <strong>{departure.applicants} / {departure.capacity}명</strong>
                    </S.CapacityRow>
                    <S.CapacityBar
                      value={departure.applicants}
                      max={departure.capacity}
                      aria-label={`${departure.dates} 신청 인원`}
                    />
                    <S.ReservationButton
                      type="button"
                      aria-label={`${departure.dates} 일정으로 예약`}
                      onClick={() => reserve(departure.id)}
                    >
                      이 일정으로 예약
                    </S.ReservationButton>
                    {selectedDeparture === departure.id && (
                      <S.ReservationNotice role="status">
                        {departure.dates} 일정을 선택했습니다.
                      </S.ReservationNotice>
                    )}
                  </S.DepartureCard>
                ))}
              </S.DepartureList>
              {message && <S.ReservationNotice role="status">{message}</S.ReservationNotice>}
            </S.DeparturesSection>
          </S.Overview>
          {tourStyles.length > 0 && <S.LowerSection aria-labelledby="tour-style-title">
            <S.SectionTitle id="tour-style-title" $compact>Tour Style</S.SectionTitle>
            <S.ThreeColumns>
              {tourStyles.map((style) => (
                <S.StyleCard key={style.name}>
                  <S.CardHeading>
                    <S.StyleTitle>{style.name}</S.StyleTitle>
                  </S.CardHeading>
                  <S.StyleDescription>{style.hotel}<br />{style.meal}</S.StyleDescription>
                </S.StyleCard>
              ))}
            </S.ThreeColumns>
          </S.LowerSection>}
          <S.LowerSection aria-labelledby="other-themes-title">
            <S.SectionTitle id="other-themes-title" $compact>Other Themes</S.SectionTitle>
            <S.ThreeColumns>
              {otherThemes.map((theme) => (
                <S.OtherTheme key={theme.name} href={theme.href} $color={theme.color}>
                  <S.OtherThemeTitle>{theme.name}</S.OtherThemeTitle>
                  <S.OtherThemeDescription>{theme.title} →</S.OtherThemeDescription>
                </S.OtherTheme>
              ))}
            </S.ThreeColumns>
          </S.LowerSection>
        </S.Content>
      </main>
    </S.Page>
  );
}

function displayDate(date: Date, year = false) {
  return new Intl.DateTimeFormat("ko-KR", {
    ...(year ? { year: "numeric" as const } : {}),
    month: "2-digit",
    day: "2-digit",
  }).format(date).replaceAll(". ", ".").replace(/\.$/, "");
}

const PRODUCT_STATUS_LABEL: Record<TravelProductStatus, string> = {
  RECRUITING: "모집 중",
  CONFIRMED: "출발 확정",
  CLOSED: "모집 마감",
  IN_PROGRESS: "여행 진행 중",
  COMPLETED: "여행 완료",
  CANCELLED: "판매 중지",
};

function minimumProductPrice(product: Awaited<ReturnType<typeof getTravelProduct>>, themeId: string) {
  const grandOrHigher = themeId === "honeymoon" || themeId === "healing";
  const hotelPrice = grandOrHigher ? product.fourStarHotelPrice : product.threeStarHotelPrice;
  const mealPrice = grandOrHigher ? product.localRestaurantPrice : product.lunchPrice;
  const transportPrice = themeId === "honeymoon" ? product.luxuryCarPrice : product.luxuryVanPrice;
  const prices = [product.baseServicePrice, hotelPrice, mealPrice, transportPrice];
  if (!prices.every((price): price is number => typeof price === "number")) return undefined;
  return prices.reduce((total, price) => total + price, 0);
}
