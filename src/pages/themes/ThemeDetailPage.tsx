import { useState } from "react";
import * as S from "./ThemeDetailPage.styles";
import { themeLinks, type ThemeDetail } from "./themeDetails";

export default function ThemeDetailPage({ theme }: { theme: ThemeDetail }) {
  const { departures, features, tourStyles } = theme;
  const otherThemes = themeLinks.filter((item) => item.id !== theme.id);
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(null);

  return (
    <S.Page>
      <S.Header>
        <S.Brand href="/">미스터 월드</S.Brand>
        <S.Nav aria-label="주 메뉴">
          <S.NavLink href="/#themes">THEME</S.NavLink>
          <S.NavLink href="#departures">RESERVATION</S.NavLink>
          <S.NavLink href="/login">LOGIN</S.NavLink>
        </S.Nav>
      </S.Header>
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
                      <strong>1인 {departure.price}원부터</strong>
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
                      onClick={() => setSelectedDeparture(departure.id)}
                    >
                      이 일정으로 예약
                    </S.ReservationButton>
                    {selectedDeparture === departure.id && (
                      <S.ReservationNotice role="status">
                        {departure.dates} 일정을 선택했습니다. 예약 기능은 준비 중입니다.
                      </S.ReservationNotice>
                    )}
                  </S.DepartureCard>
                ))}
              </S.DepartureList>
            </S.DeparturesSection>
          </S.Overview>
          <S.LowerSection aria-labelledby="tour-style-title">
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
          </S.LowerSection>
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
