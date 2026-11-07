import { useMemo, useState, type FormEvent } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import StaffHeader from "./StaffHeader";
import { loadInventory, type InventoryId } from "./staffInventory";
import * as S from "./StaffPage.styles";

type ThemeId = "honeymoon" | "healing" | "golf" | "trekking";
type Product = {
  id: string;
  themeId: ThemeId;
  title: string;
  code: string;
  start: string;
  end: string;
  duration: string;
  price: number;
  applicants: number;
  capacity: number;
  status: "모집 중" | "출발 확정";
};

const currency = new Intl.NumberFormat("ko-KR");
const themeInfo: Record<ThemeId, { title: string; category: string; color: string; code: string; gift: string; inventoryId: InventoryId; unit: string }> = {
  honeymoon: { title: "허니문 낭만 투어", category: "허니문", color: "#8b3140", code: "HNY", gift: "커플 기념티", inventoryId: "couple-shirt", unit: "벌" },
  healing: { title: "효도 힐링 투어", category: "힐링", color: "#8a7129", code: "HLG", gift: "건강 인삼", inventoryId: "ginseng", unit: "박스" },
  golf: { title: "골프 챌린지 투어", category: "골프", color: "#2d613f", code: "GLF", gift: "골프공", inventoryId: "golf-ball", unit: "개" },
  trekking: { title: "아웃도어 트레킹 투어", category: "트레킹", color: "#38546c", code: "TRK", gift: "아웃도어 스카프", inventoryId: "scarf", unit: "장" },
};

const initialProducts: Product[] = [
  { id: "1", themeId: "honeymoon", title: "허니문 낭만 투어", code: "P-261107-HNY", start: "2026.11.07", end: "11.12", duration: "5박 6일", price: 1890000, applicants: 2, capacity: 8, status: "모집 중" },
  { id: "2", themeId: "trekking", title: "아웃도어 트레킹 투어", code: "P-261114-TRK", start: "2026.11.14", end: "11.18", duration: "4박 5일", price: 990000, applicants: 1, capacity: 10, status: "모집 중" },
  { id: "3", themeId: "golf", title: "골프 챌린지 투어", code: "P-261121-GLF", start: "2026.11.21", end: "11.24", duration: "3박 4일", price: 1590000, applicants: 4, capacity: 10, status: "출발 확정" },
  { id: "4", themeId: "healing", title: "효도 힐링 투어", code: "P-261205-HLG", start: "2026.12.05", end: "12.09", duration: "4박 5일", price: 1290000, applicants: 2, capacity: 10, status: "모집 중" },
  { id: "5", themeId: "honeymoon", title: "허니문 낭만 투어", code: "P-261219-HNY", start: "2026.12.19", end: "12.23", duration: "4박 5일", price: 2140000, applicants: 0, capacity: 8, status: "모집 중" },
  { id: "6", themeId: "trekking", title: "아웃도어 트레킹 투어", code: "P-261128-TRK", start: "2026.11.28", end: "12.01", duration: "3박 4일", price: 890000, applicants: 4, capacity: 10, status: "출발 확정" },
  { id: "7", themeId: "golf", title: "골프 챌린지 투어", code: "P-261212-GLF", start: "2026.12.12", end: "12.16", duration: "4박 5일", price: 1720000, applicants: 1, capacity: 10, status: "모집 중" },
  { id: "8", themeId: "healing", title: "효도 힐링 투어", code: "P-270109-HLG", start: "2027.01.09", end: "01.12", duration: "3박 4일", price: 1180000, applicants: 0, capacity: 10, status: "모집 중" },
];

function toDisplayDate(value: string) {
  return value.replaceAll("-", ".");
}

function durationBetween(start: string, end: string) {
  const nights = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
  return `${nights}박 ${nights + 1}일`;
}

export default function StaffPage() {
  const [themeId, setThemeId] = useState<ThemeId>("trekking");
  const [startDate, setStartDate] = useState("2026-12-19");
  const [endDate, setEndDate] = useState("2026-12-23");
  const [capacityInput, setCapacityInput] = useState("10");
  const [basePriceInput, setBasePriceInput] = useState("1050000");
  const [hotel, setHotel] = useState("3성 호텔");
  const [meal, setMeal] = useState("도시락");
  const [transport, setTransport] = useState("10인 승합 고급차량");
  const [hotelPrices, setHotelPrices] = useState<Record<string, string>>({ "3성 호텔": "0", "4성 호텔": "180000", "5성 호텔": "420000" });
  const [mealPrices, setMealPrices] = useState<Record<string, string>>({ "도시락": "0", "현지식 레스토랑": "90000", "스테이크 & 샴페인": "240000" });
  const [transportPrices, setTransportPrices] = useState<Record<string, string>>({ "2인 고급차량": "90000", "10인 승합 고급차량": "0" });
  const [extraPrices, setExtraPrices] = useState({ champagne: "40000", coffee: "7000" });
  const [products, setProducts] = useState(initialProducts);
  const [inventory] = useState(loadInventory);
  const [productFilter, setProductFilter] = useState<"all" | ThemeId>("all");
  const [message, setMessage] = useState("");
  const selectedTheme = themeInfo[themeId];
  const selectedStock = inventory[selectedTheme.inventoryId];
  const capacity = Number(capacityInput) || 0;
  const basePrice = Number(basePriceInput) || 0;
  const stockShortage = Math.max(0, capacity - selectedStock.amount);
  const productCode = useMemo(() => `P-${startDate.slice(2).replaceAll("-", "")}-${selectedTheme.code}`, [selectedTheme.code, startDate]);
  const filteredProducts = useMemo(
    () => productFilter === "all" ? products : products.filter((product) => product.themeId === productFilter),
    [productFilter, products],
  );

  function registerProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      setMessage("여행 종료일은 시작일보다 늦어야 합니다.");
      return;
    }
    if (selectedStock.amount < capacity) {
      setMessage(`${selectedTheme.gift} 재고가 최대 인원보다 부족합니다.`);
      return;
    }

    const product: Product = {
      id: crypto.randomUUID(),
      themeId,
      title: selectedTheme.title,
      code: productCode,
      start: toDisplayDate(startDate),
      end: toDisplayDate(endDate).slice(5),
      duration: durationBetween(startDate, endDate),
      price: basePrice,
      applicants: 0,
      capacity,
      status: "모집 중",
    };
    setProducts((current) => [product, ...current]);
    setMessage(`${product.title} 상품이 등록되었습니다.`);
  }

  return (
    <S.Page>
      <StaffHeader current="product" />

      <S.Main>
        <S.Eyebrow>PRODUCT</S.Eyebrow>
        <S.Title>상품 기획</S.Title>
        <S.Description>테마를 골라 출발일·기간·가격·최대 인원을 정하고 출발 상품을 등록해요.</S.Description>

        <S.Workspace>
          <S.Form id="product-form" onSubmit={registerProduct}>
            <S.FormTitle>새 상품 등록</S.FormTitle>
            <S.FieldLabel>테마</S.FieldLabel>
            <S.ThemeGrid>
              {(Object.entries(themeInfo) as [ThemeId, typeof selectedTheme][]).map(([id, info]) => (
                <S.ThemeButton key={id} type="button" $selected={themeId === id} onClick={() => setThemeId(id)}>
                  <i style={{ background: info.color }} />{info.title}
                </S.ThemeButton>
              ))}
            </S.ThemeGrid>

            <S.TwoColumns>
              <S.Field><S.FieldLabel htmlFor="staff-start-date">여행 시작일</S.FieldLabel><S.Input id="staff-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></S.Field>
              <S.Field><S.FieldLabel htmlFor="staff-end-date">여행 종료일</S.FieldLabel><S.Input id="staff-end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></S.Field>
            </S.TwoColumns>
            <S.Field><S.FieldLabel htmlFor="staff-capacity">최대 인원</S.FieldLabel><S.Input id="staff-capacity" type="number" min="3" max="100" value={capacityInput} onChange={(event) => setCapacityInput(event.target.value)} required /></S.Field>

            <S.StockNotice id="stock-notice" $insufficient={stockShortage > 0}>
              <span>
                <strong>{stockShortage > 0 && <FiAlertTriangle aria-hidden="true" />}창고 재고 · {selectedTheme.gift}</strong>
                <small>{stockShortage > 0
                  ? `재고가 ${stockShortage}${selectedTheme.unit} 부족해요. 최대 인원을 ${selectedStock.amount}명 이하로 줄이거나 창고 재고 화면에서 입고한 뒤 등록하세요.`
                  : "최대 인원 모두에게 기념품을 줄 수 있어요."}</small>
              </span>
              <b>{selectedStock.amount}{selectedTheme.unit} 보유 / 최대 인원 {capacity}명 필요</b>
            </S.StockNotice>

            <S.PriceField><S.FieldLabel htmlFor="staff-price">1인 기본가 (원)</S.FieldLabel><small>클래식 등급 기준이며 항공료·가이드 비용 등을 포함한 금액이에요.</small><S.Input id="staff-price" type="number" min="0" step="1000" value={basePriceInput} onChange={(event) => setBasePriceInput(event.target.value)} required /></S.PriceField>

            <S.OptionHeading>구성별 추가 금액 (1인 · 원)</S.OptionHeading>
            <S.OptionHelp>고객이 기본 구성에서 바꿀 때 더해지는 금액이에요. 기본 구성은 기본가에 포함돼요.</S.OptionHelp>
            <S.OptionGroup>
              <S.FieldLabel>호텔</S.FieldLabel>
              <S.OptionGrid $columns={3}>{["3성 호텔", "4성 호텔", "5성 호텔"].map((name) => {
                const selected = hotel === name;
                return <S.OptionCard key={name} $selected={selected}><S.OptionChoice type="button" onClick={() => setHotel(name)}><strong>{name}</strong></S.OptionChoice>{selected ? <S.IncludedPrice>기본가 포함</S.IncludedPrice> : <S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={hotelPrices[name]} onChange={(event) => setHotelPrices((current) => ({ ...current, [name]: event.target.value }))} /></S.EditablePrice>}</S.OptionCard>;
              })}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup>
              <S.FieldLabel>식사</S.FieldLabel>
              <S.OptionGrid $columns={3}>{["도시락", "현지식 레스토랑", "스테이크 & 샴페인"].map((name) => {
                const selected = meal === name;
                return <S.OptionCard key={name} $selected={selected}><S.OptionChoice type="button" onClick={() => setMeal(name)}><strong>{name}</strong></S.OptionChoice>{selected ? <S.IncludedPrice>기본가 포함</S.IncludedPrice> : <S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={mealPrices[name]} onChange={(event) => setMealPrices((current) => ({ ...current, [name]: event.target.value }))} /></S.EditablePrice>}</S.OptionCard>;
              })}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup>
              <S.FieldLabel>교통</S.FieldLabel>
              <S.OptionGrid $columns={2}>{["2인 고급차량", "10인 승합 고급차량"].map((name) => {
                const selected = transport === name;
                return <S.OptionCard key={name} $selected={selected}><S.OptionChoice type="button" onClick={() => setTransport(name)}><strong>{name}</strong></S.OptionChoice>{selected ? <S.IncludedPrice>기본가 포함</S.IncludedPrice> : <S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={transportPrices[name]} onChange={(event) => setTransportPrices((current) => ({ ...current, [name]: event.target.value }))} /></S.EditablePrice>}</S.OptionCard>;
              })}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup><S.FieldLabel>추가 옵션</S.FieldLabel><S.FixedOptions><span><strong>샴페인</strong><S.EditablePrice><b>+</b><input aria-label="샴페인 추가 금액" type="number" min="0" step="1000" value={extraPrices.champagne} onChange={(event) => setExtraPrices((current) => ({ ...current, champagne: event.target.value }))} /></S.EditablePrice></span><span><strong>커피</strong><S.EditablePrice><b>+</b><input aria-label="커피 추가 금액" type="number" min="0" step="1000" value={extraPrices.coffee} onChange={(event) => setExtraPrices((current) => ({ ...current, coffee: event.target.value }))} /></S.EditablePrice></span></S.FixedOptions></S.OptionGroup>

            <S.Warning><strong>주의</strong> 등록한 상품은 수정하거나 삭제할 수 없고 판매 중지도 할 수 없어요. 일정과 금액을 다시 한 번 확인해 주세요.</S.Warning>
            <S.RegisterButton type="submit" disabled={stockShortage > 0}>상품 등록</S.RegisterButton>
            <S.FormMessage role="status">{message}</S.FormMessage>
          </S.Form>

          <S.ProductSection id="registered-products">
            <S.ProductCount>등록된 상품 {filteredProducts.length}개</S.ProductCount>
            <S.ProductFilters aria-label="상품 테마 필터">
              <S.FilterButton type="button" $selected={productFilter === "all"} onClick={() => setProductFilter("all")}>전체</S.FilterButton>
              {(Object.entries(themeInfo) as [ThemeId, typeof selectedTheme][]).map(([id, info]) => (
                <S.FilterButton key={id} type="button" $selected={productFilter === id} onClick={() => setProductFilter(id)}>
                  <i style={{ background: info.color }} />
                  {info.category}
                </S.FilterButton>
              ))}
            </S.ProductFilters>
            <S.ProductList>
              {filteredProducts.map((product) => (
                <S.ProductCard key={product.id}>
                  <S.ProductHead><S.ProductName><i style={{ background: themeInfo[product.themeId].color }} /><span><strong>{product.title}</strong><small>{product.code}</small></span></S.ProductName><S.Status $confirmed={product.status === "출발 확정"}>{product.status}</S.Status></S.ProductHead>
                  <S.ProductInfo>{product.start} – {product.end} · {product.duration} · 1인 {currency.format(product.price)}원</S.ProductInfo>
                  <S.ProductInfo>신청 {product.applicants}명 / 최대 {product.capacity}명</S.ProductInfo>
                </S.ProductCard>
              ))}
              {filteredProducts.length === 0 && <S.EmptyProducts>선택한 테마에 등록된 상품이 없습니다.</S.EmptyProducts>}
            </S.ProductList>
          </S.ProductSection>
        </S.Workspace>
      </S.Main>
    </S.Page>
  );
}
