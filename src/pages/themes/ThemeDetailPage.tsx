import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getAccessToken, getErrorMessage } from "../../api/client";
import { getTravelProduct, getTravelProducts, type ThemeCode } from "../../api/services";
import * as S from "./ThemeDetailPage.styles";
import { themeLinks, type ThemeDetail } from "./themeDetails";

export default function ThemeDetailPage({ theme }: { theme: ThemeDetail }) {
  const { features } = theme;
  const otherThemes = themeLinks.filter((item) => item.id !== theme.id);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(null);
  const [departures, setDepartures] = useState<ThemeDetail["departures"]>([]);
  const [tourStyles, setTourStyles] = useState<ThemeDetail["tourStyles"]>([]);
  const [message, setMessage] = useState("여행 상품을 불러오는 중입니다.");

  useEffect(() => {
    let active = true;
    getTravelProducts(theme.id.toUpperCase() as ThemeCode)
      .then((products) => Promise.all(products.map((product) => getTravelProduct(product.travelProductId).catch(() => product))))
      .then((products) => {
        if (!active) return;
        const availableProducts = products.filter((product) => product.status !== "CANCELLED");
        setDepartures(availableProducts.map((product) => {
            const start = new Date(product.departureDate);
            const end = new Date(product.returnDate);
            const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
            return {
              id: String(product.travelProductId),
              dates: `${displayDate(start, true)} – ${displayDate(end)}`,
              duration: `${nights}박 ${nights + 1}일`,
              price: minimumProductPrice(product)?.toLocaleString("ko-KR") ?? "가격 정보 없음",
              applicants: product.currentParticipants,
              capacity: product.capacity,
            };
          }));
        setTourStyles(availableProducts[0] ? productTourStyles(availableProducts[0], theme) : []);
        setMessage(availableProducts.length === 0 ? "현재 모집 중인 여행 상품이 없습니다." : "");
      })
      .catch((error) => {
        if (!active) return;
        setDepartures([]);
        setTourStyles([]);
        setMessage(getAccessToken() ? getErrorMessage(error) : "로그인하면 모집 중인 여행 상품을 확인할 수 있습니다.");
      });
    return () => { active = false; };
  }, [theme]);

  function reserve(departureId: string) {
    setSelectedDeparture(departureId);
    window.sessionStorage.setItem("selectedTravelProductId", departureId);
    window.location.assign(getAccessToken() ? "/booking" : "/reservation");
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
                      <S.Badge $confirmed={departure.applicants >= 3}>
                        {departure.applicants >= 3 ? "출발 확정" : "모집 중"}
                      </S.Badge>
                    </S.CardHeading>
                    <S.DetailRow>
                      <span>{departure.duration}</span>
                      <strong>{departure.price === "가격 정보 없음" ? departure.price : `1인 ${departure.price}원부터`}</strong>
                    </S.DetailRow>
                    <S.CapacityRow>
                      <span>신청 인원 (최소 3명)</span>
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
                <S.StyleCard key={style.name} $unavailable={style.unavailable}>
                  <S.CardHeading>
                    <S.StyleTitle>{style.name}</S.StyleTitle>
                    <S.StylePrice>{style.price}원~</S.StylePrice>
                  </S.CardHeading>
                  <S.StyleDescription>{style.hotel}<br />{style.meal}</S.StyleDescription>
                  {style.unavailable && <S.UnavailableNote>이 테마에서는 선택 불가</S.UnavailableNote>}
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

function minimumProductPrice(product: Awaited<ReturnType<typeof getTravelProduct>>) {
  const required = [product.baseServicePrice, product.flightPrice];
  const hotel = [product.threeStarHotelPrice, product.fourStarHotelPrice, product.fiveStarHotelPrice].filter((value): value is number => typeof value === "number");
  const meal = [product.lunchPrice, product.localRestaurantPrice, product.steakPrice].filter((value): value is number => typeof value === "number");
  const transport = [product.luxuryCarPrice, product.luxuryVanPrice].filter((value): value is number => typeof value === "number");
  if (required.some((value) => typeof value !== "number") || hotel.length === 0 || meal.length === 0 || transport.length === 0) return undefined;
  return (product.baseServicePrice ?? 0) + (product.flightPrice ?? 0) + Math.min(...hotel) + Math.min(...meal) + Math.min(...transport);
}

function productTourStyles(product: Awaited<ReturnType<typeof getTravelProduct>>, theme: ThemeDetail): ThemeDetail["tourStyles"] {
  const base = (product.baseServicePrice ?? 0) + (product.flightPrice ?? 0);
  const transport = theme.id === "honeymoon" ? product.luxuryCarPrice ?? 0 : product.luxuryVanPrice ?? 0;
  const prices = [
    base + transport + (product.threeStarHotelPrice ?? 0) + (product.lunchPrice ?? 0),
    base + transport + (product.fourStarHotelPrice ?? 0) + (product.localRestaurantPrice ?? 0),
    base + transport + (product.fiveStarHotelPrice ?? 0) + (product.steakPrice ?? 0),
  ];
  return theme.tourStyles.map((style, index) => ({
    ...style,
    price: prices[index].toLocaleString("ko-KR"),
  }));
}
