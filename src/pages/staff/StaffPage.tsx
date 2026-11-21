import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { FiAlertTriangle, FiChevronDown } from "react-icons/fi";
import { getErrorMessage } from "../../api/client";
import { getInventory, type InventoryApiItem } from "../../services/inventoryService";
import { createTravelProduct, deleteTravelProduct, getStaffTravelProducts, getTravelProduct, minimumApplicantsForTheme, type ThemeCode, type TravelProduct, type TravelProductStatus } from "../../services/travelProductService";
import Modal from "../../components/Modal";
import StaffHeader from "./StaffHeader";
import StaffProductStatus from "./StaffProductStatusBadge";
import { type InventoryId } from "./staffInventory";
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
  price?: number;
  applicants: number;
  capacity: number;
  status: TravelProductStatus;
  optionPrices: {
    baseService?: number;
    threeStarHotel?: number;
    fourStarHotel?: number;
    fiveStarHotel?: number;
    lunch?: number;
    localRestaurant?: number;
    steak?: number;
    luxuryCar?: number;
    luxuryVan?: number;
  };
};

const currency = new Intl.NumberFormat("ko-KR");
const FIXED_DRINK_PRICES = { champagne: 70_000, coffee: 15_000 } as const;
const themeInfo: Record<ThemeId, { title: string; category: string; color: string; code: string; gift: string; inventoryId: InventoryId; unit: string }> = {
  honeymoon: { title: "허니문 낭만 투어", category: "허니문", color: "#8b3140", code: "HNY", gift: "커플 기념티", inventoryId: "couple-shirt", unit: "벌" },
  healing: { title: "효도 힐링 투어", category: "힐링", color: "#8a7129", code: "HLG", gift: "건강 인삼", inventoryId: "ginseng", unit: "박스" },
  golf: { title: "골프 챌린지 투어", category: "골프", color: "#2d613f", code: "GLF", gift: "골프공", inventoryId: "golf-ball", unit: "개" },
  trekking: { title: "아웃도어 트레킹 투어", category: "트레킹", color: "#38546c", code: "TRK", gift: "아웃도어 스카프", inventoryId: "scarf", unit: "장" },
};

const THEME_TO_API: Record<ThemeId, ThemeCode> = { honeymoon: "HONEYMOON", healing: "HEALING", golf: "GOLF", trekking: "TREKKING" };
const API_TO_THEME: Record<ThemeCode, ThemeId> = { HONEYMOON: "honeymoon", HEALING: "healing", GOLF: "golf", TREKKING: "trekking" };
const INVENTORY_API_TO_ID: Record<InventoryApiItem, InventoryId> = {
  COUPLE_TSHIRT: "couple-shirt",
  GINSENG: "ginseng",
  GOLF_BALL: "golf-ball",
  SCARF: "scarf",
};

function toDisplayDate(value: string) {
  return value.replaceAll("-", ".");
}

function durationBetween(start: string, end: string) {
  const nights = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
  return `${nights}박 ${nights + 1}일`;
}

function nextDate(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

export default function StaffPage() {
  const [activeView, setActiveView] = useState<"create" | "list">("create");
  const [themeId, setThemeId] = useState<ThemeId | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacityInput, setCapacityInput] = useState("");
  const [basePriceInput, setBasePriceInput] = useState("");
  const [hotelPrices, setHotelPrices] = useState<Record<string, string>>({ "3성 호텔": "", "4성 호텔": "", "5성 호텔": "" });
  const [mealPrices, setMealPrices] = useState<Record<string, string>>({ "도시락": "", "현지식 레스토랑": "", "스테이크": "" });
  const [transportPrices, setTransportPrices] = useState<Record<string, string>>({ "2인 고급차량": "", "10인 승합 고급차량": "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryQuantities, setInventoryQuantities] = useState<Partial<Record<InventoryId, number>>>({});
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");
  const [productFilter, setProductFilter] = useState<"all" | ThemeId>("all");
  const [message, setMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Product | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const cancelCloseTimerRef = useRef<number | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const selectedTheme = themeId ? themeInfo[themeId] : null;
  const requiresGrandOrHigher = themeId === "honeymoon" || themeId === "healing";
  const minimumCapacity = themeId ? minimumApplicantsForTheme(THEME_TO_API[themeId]) : 3;
  const selectedStockAmount = selectedTheme ? inventoryQuantities[selectedTheme.inventoryId] : undefined;
  const capacity = Number(capacityInput) || 0;
  const basePrice = Number(basePriceInput) || 0;

  useEffect(() => () => {
    if (cancelCloseTimerRef.current !== null) window.clearTimeout(cancelCloseTimerRef.current);
  }, []);
  const stockShortage = selectedStockAmount === undefined ? 0 : Math.max(0, capacity - selectedStockAmount);
  const filteredProducts = useMemo(
    () => productFilter === "all" ? products : products.filter((product) => product.themeId === productFilter),
    [productFilter, products],
  );

  useEffect(() => {
    let active = true;
    loadProducts()
      .then((items) => { if (active) setProducts(items); })
      .catch((error) => { if (active) setProductMessage(getErrorMessage(error)); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    loadInventoryQuantities()
      .then((quantities) => {
        if (!active) return;
        setInventoryQuantities(quantities);
        setInventoryError("");
      })
      .catch((error) => {
        if (active) setInventoryError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setInventoryLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function registerProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!themeId || !selectedTheme) {
      setMessage("상품 테마를 먼저 선택해 주세요.");
      return;
    }
    if (selectedStockAmount === undefined) {
      setMessage("서버 재고를 확인할 수 없어 상품을 등록할 수 없습니다.");
      return;
    }
    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      setMessage("여행 종료일은 시작일보다 늦어야 합니다.");
      return;
    }
    if (capacity < minimumCapacity) {
      setMessage(`${selectedTheme.title}의 최대 인원은 최소 ${minimumCapacity}명이어야 합니다.`);
      return;
    }
    if (themeId === "honeymoon" && capacity % 2 !== 0) {
      setMessage("허니문 상품의 최대 인원은 짝수로 입력해 주세요.");
      return;
    }
    if (selectedStockAmount < capacity) {
      setMessage(`${selectedTheme.gift} 재고가 최대 인원보다 부족합니다.`);
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await createTravelProduct({
        theme: THEME_TO_API[themeId],
        departureDate: `${startDate}T00:00:00`,
        returnDate: `${endDate}T00:00:00`,
        baseServicePrice: basePrice,
        flightPrice: 0,
        threeStarHotelPrice: requiresGrandOrHigher ? 0 : Number(hotelPrices["3성 호텔"]),
        fourStarHotelPrice: Number(hotelPrices["4성 호텔"]),
        fiveStarHotelPrice: Number(hotelPrices["5성 호텔"]),
        lunchPrice: requiresGrandOrHigher ? 0 : Number(mealPrices["도시락"]),
        localRestaurantPrice: Number(mealPrices["현지식 레스토랑"]),
        steakPrice: Number(mealPrices["스테이크"]),
        luxuryCarPrice: Number(transportPrices["2인 고급차량"]),
        luxuryVanPrice: Number(transportPrices["10인 승합 고급차량"]),
        capacity,
        validTravelPeriod: true,
      });
      const nextProducts = await loadProducts();
      setProducts(nextProducts);
      try {
        setInventoryQuantities(await loadInventoryQuantities());
        setInventoryError("");
      } catch (error) {
        setInventoryError(getErrorMessage(error));
      }
      setMessage(`${selectedTheme.title} 상품이 등록되었습니다.`);
      setProductMessage(`${selectedTheme.title} 상품이 등록되었습니다.`);
      setActiveView("list");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelProduct() {
    if (!cancelTarget) return;
    const target = cancelTarget;
    setSubmitting(true);
    try {
      await deleteTravelProduct(Number(target.id));
      setCancelModalOpen(false);
      if (cancelCloseTimerRef.current !== null) window.clearTimeout(cancelCloseTimerRef.current);
      cancelCloseTimerRef.current = window.setTimeout(() => {
        setProducts((current) => sortProducts(current.map((product) =>
          product.id === target.id ? { ...product, status: "CANCELLED" } : product,
        )));
        setProductMessage(`${target.title} ${target.start} 상품이 취소되었습니다.`);
        setCancelTarget(null);
        setSubmitting(false);
        cancelCloseTimerRef.current = null;
      }, 500);
    } catch (error) {
      setProductMessage(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  function openCancelModal(product: Product) {
    if (cancelCloseTimerRef.current !== null) window.clearTimeout(cancelCloseTimerRef.current);
    cancelCloseTimerRef.current = null;
    setCancelTarget(product);
    setCancelModalOpen(true);
  }

  function closeCancelModal() {
    setCancelModalOpen(false);
    if (cancelCloseTimerRef.current !== null) window.clearTimeout(cancelCloseTimerRef.current);
    cancelCloseTimerRef.current = window.setTimeout(() => {
      setCancelTarget(null);
      cancelCloseTimerRef.current = null;
    }, 500);
  }

  return (
    <S.Page>
      <StaffHeader current="product" />

      <S.Main>
        <S.Eyebrow>PRODUCT</S.Eyebrow>
        <S.Title>상품 기획</S.Title>
        <S.Description>테마를 골라 출발일·기간·가격·최대 인원을 정하고 출발 상품을 등록해요.</S.Description>
        <S.ViewTabs aria-label="상품 기획 메뉴">
          <S.ViewTab type="button" $selected={activeView === "create"} onClick={() => setActiveView("create")}>상품 등록</S.ViewTab>
          <S.ViewTab type="button" $selected={activeView === "list"} onClick={() => setActiveView("list")}>등록 조회</S.ViewTab>
        </S.ViewTabs>

        <S.Workspace>
          {activeView === "create" ? (
          <S.Form id="product-form" onSubmit={registerProduct}>
            <S.FormTitle>새 상품 등록</S.FormTitle>
            <S.FieldLabel>테마</S.FieldLabel>
            <S.ThemeGrid>
              {(Object.entries(themeInfo) as [ThemeId, (typeof themeInfo)[ThemeId]][]).map(([id, info]) => (
                <S.ThemeButton key={id} type="button" $selected={themeId === id} onClick={() => {
                  setThemeId(id);
                  const nextMinimumCapacity = minimumApplicantsForTheme(THEME_TO_API[id]);
                  setCapacityInput((current) => current && (Number(current) < nextMinimumCapacity || (id === "honeymoon" && Number(current) % 2 !== 0)) ? "" : current);
                }}>
                  <i style={{ background: info.color }} />{info.title}
                </S.ThemeButton>
              ))}
            </S.ThemeGrid>

            <S.TwoColumns>
              <S.Field><S.FieldLabel htmlFor="staff-start-date">여행 시작일</S.FieldLabel><S.Input id="staff-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></S.Field>
              <S.Field><S.FieldLabel htmlFor="staff-end-date">여행 종료일</S.FieldLabel><S.Input id="staff-end-date" type="date" min={startDate ? nextDate(startDate) : undefined} value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></S.Field>
            </S.TwoColumns>
            <S.Field><S.FieldLabel htmlFor="staff-capacity">최대 인원 (최소 {minimumCapacity}명)</S.FieldLabel><S.Input id="staff-capacity" type="number" min={minimumCapacity} step={themeId === "honeymoon" ? 2 : 1} value={capacityInput} onChange={(event) => setCapacityInput(event.target.value)} required /></S.Field>

            {!selectedTheme ? <S.StockNotice id="stock-notice" $insufficient={false}><span><strong>테마를 선택해 주세요.</strong><small>테마를 선택하면 기념품 재고와 선택 가능한 구성을 확인할 수 있어요.</small></span></S.StockNotice> : inventoryLoading ? (
              <S.StockNotice id="stock-notice" $insufficient={false}><span><strong>창고 재고를 불러오는 중입니다.</strong><small>서버의 최신 재고를 확인하고 있어요.</small></span></S.StockNotice>
            ) : selectedStockAmount === undefined ? (
              <S.StockNotice id="stock-notice" $insufficient><span><strong><FiAlertTriangle aria-hidden="true" />창고 재고를 확인할 수 없습니다.</strong><small>{inventoryError || "잠시 후 다시 시도해 주세요."}</small></span></S.StockNotice>
            ) : <S.StockNotice id="stock-notice" $insufficient={stockShortage > 0}>
              <span>
                <strong>{stockShortage > 0 && <FiAlertTriangle aria-hidden="true" />}창고 재고 · {selectedTheme.gift}</strong>
                <small>{stockShortage > 0
                  ? `재고가 ${stockShortage}${selectedTheme.unit} 부족해요. 최대 인원을 ${selectedStockAmount}명 이하로 줄이거나 창고 재고 화면에서 입고한 뒤 등록하세요.`
                  : "최대 인원 모두에게 기념품을 줄 수 있어요."}</small>
              </span>
              <b>{selectedStockAmount}{selectedTheme.unit} 보유 / 최대 인원 {capacity}명 필요</b>
            </S.StockNotice>}

            <S.PriceField><S.FieldLabel htmlFor="staff-price">1인 기본가 (원)</S.FieldLabel><small>클래식 등급 기준이며 항공료·가이드 비용 등을 포함한 금액이에요.</small><S.Input id="staff-price" type="number" min="0" step="1000" value={basePriceInput} onChange={(event) => setBasePriceInput(event.target.value)} required /></S.PriceField>

            <S.OptionHeading>구성별 추가 금액 (1인 · 원)</S.OptionHeading>
            <S.OptionHelp>선택 가능한 호텔·식사·교통의 추가 금액을 각각 입력해 주세요. 선택 불가 항목은 상품에 포함되지 않아요.</S.OptionHelp>
            <S.OptionGroup>
              <S.FieldLabel>호텔</S.FieldLabel>
              <S.OptionGrid $columns={requiresGrandOrHigher ? 2 : 3}>{(requiresGrandOrHigher ? ["4성 호텔", "5성 호텔"] : ["3성 호텔", "4성 호텔", "5성 호텔"]).map((name) => (
                <S.OptionCard key={name} $selected={false}><S.OptionCardTitle>{name}</S.OptionCardTitle><S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={hotelPrices[name]} onChange={(event) => setHotelPrices((current) => ({ ...current, [name]: event.target.value }))} required /></S.EditablePrice></S.OptionCard>
              ))}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup>
              <S.FieldLabel>식사</S.FieldLabel>
              <S.OptionGrid $columns={requiresGrandOrHigher ? 2 : 3}>{(requiresGrandOrHigher ? ["현지식 레스토랑", "스테이크"] : ["도시락", "현지식 레스토랑", "스테이크"]).map((name) => (
                <S.OptionCard key={name} $selected={false}><S.OptionCardTitle>{name}</S.OptionCardTitle><S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={mealPrices[name]} onChange={(event) => setMealPrices((current) => ({ ...current, [name]: event.target.value }))} required /></S.EditablePrice></S.OptionCard>
              ))}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup>
              <S.FieldLabel>교통</S.FieldLabel>
              <S.OptionGrid $columns={2}>{["2인 고급차량", "10인 승합 고급차량"].map((name) => {
                return <S.OptionCard key={name} $selected={false}><S.OptionCardTitle>{name}</S.OptionCardTitle><S.EditablePrice><b>+</b><input aria-label={`${name} 추가 금액`} type="number" min="0" step="1000" value={transportPrices[name]} onChange={(event) => setTransportPrices((current) => ({ ...current, [name]: event.target.value }))} required /></S.EditablePrice></S.OptionCard>;
              })}</S.OptionGrid>
            </S.OptionGroup>
            <S.OptionGroup><S.FieldLabel>추가 옵션</S.FieldLabel><S.FixedOptions><span><strong>샴페인</strong><small>+{currency.format(FIXED_DRINK_PRICES.champagne)}원</small></span><span><strong>커피</strong><small>+{currency.format(FIXED_DRINK_PRICES.coffee)}원</small></span></S.FixedOptions></S.OptionGroup>

            <S.Warning><strong>주의</strong> 등록한 상품의 일정과 금액은 수정할 수 없어요. 상품 취소 시 예약자에게 취소 안내가 필요하므로 등록 전 다시 한 번 확인해 주세요.</S.Warning>
            <S.RegisterButton type="submit" disabled={!themeId || inventoryLoading || selectedStockAmount === undefined || stockShortage > 0 || submitting}>{submitting ? "등록 중..." : "상품 등록"}</S.RegisterButton>
            <S.FormMessage role="status">{message}</S.FormMessage>
          </S.Form>
          ) : (
          <S.ProductSection id="registered-products">
            <S.ProductCount>등록된 상품 {filteredProducts.length}개</S.ProductCount>
            <S.ProductFilters aria-label="상품 테마 필터">
              <S.FilterButton type="button" $selected={productFilter === "all"} onClick={() => setProductFilter("all")}>전체</S.FilterButton>
              {(Object.entries(themeInfo) as [ThemeId, (typeof themeInfo)[ThemeId]][]).map(([id, info]) => (
                <S.FilterButton key={id} type="button" $selected={productFilter === id} onClick={() => setProductFilter(id)}>
                  <i style={{ background: info.color }} />
                  {info.category}
                </S.FilterButton>
              ))}
            </S.ProductFilters>
            <S.ProductMessage role="status">{productMessage}</S.ProductMessage>
            <S.ProductList>
              {filteredProducts.map((product) => {
                const priceOpen = expandedProductId === product.id;
                const pricePanelId = `product-option-prices-${product.id}`;
                const cancellable = product.status === "RECRUITING" || product.status === "CONFIRMED" || product.status === "CLOSED";
                return (
                <S.ProductCard key={product.id} $cancelled={product.status === "CANCELLED"}>
                  <S.ProductHead><S.ProductName><i style={{ background: themeInfo[product.themeId].color }} /><span><strong>{product.title}</strong><small>{product.code}</small></span></S.ProductName><StaffProductStatus status={product.status} /></S.ProductHead>
                  <S.ProductInfo>{product.start} – {product.end} · {product.duration} · {product.price === undefined ? "가격 정보 없음" : `1인 최저 구성 ${currency.format(product.price)}원`}</S.ProductInfo>
                  <S.ProductCapacityRow><S.ProductInfo>신청 {product.applicants}명 / 최대 {product.capacity}명</S.ProductInfo><S.CancelProductButton type="button" disabled={!cancellable} onClick={() => openCancelModal(product)}>{product.status === "CANCELLED" ? "취소 완료" : cancellable ? "상품 취소" : "취소 불가"}</S.CancelProductButton></S.ProductCapacityRow>
                  <S.PriceToggleButton type="button" $open={priceOpen} onClick={() => setExpandedProductId(priceOpen ? null : product.id)} aria-expanded={priceOpen} aria-controls={pricePanelId}>
                    <span>옵션 가격 {priceOpen ? "접기" : "보기"}</span><FiChevronDown aria-hidden="true" />
                  </S.PriceToggleButton>
                  <S.OptionPricePanel id={pricePanelId} $open={priceOpen} aria-hidden={!priceOpen}>
                    <S.OptionPriceInner>
                      <S.BasePriceGrid>
                        <PriceItem label="기본 서비스" value={product.optionPrices.baseService} />
                      </S.BasePriceGrid>
                      <PriceGroup title="호텔" items={[
                        ...(requiresGrandOrHigherTheme(product.themeId) ? [] : [["3성 호텔", product.optionPrices.threeStarHotel] as [string, number | undefined]]),
                        ["4성 호텔", product.optionPrices.fourStarHotel],
                        ["5성 호텔", product.optionPrices.fiveStarHotel],
                      ]} />
                      <PriceGroup title="식사" items={[
                        ...(requiresGrandOrHigherTheme(product.themeId) ? [] : [["도시락", product.optionPrices.lunch] as [string, number | undefined]]),
                        ["현지식 레스토랑", product.optionPrices.localRestaurant],
                        ["스테이크", product.optionPrices.steak],
                      ]} />
                      <PriceGroup title="교통" items={[
                        ["2인 고급차량", product.optionPrices.luxuryCar],
                        ["10인 승합 고급차량", product.optionPrices.luxuryVan],
                      ]} />
                      <PriceGroup title="추가 옵션" items={[
                        ["샴페인", FIXED_DRINK_PRICES.champagne],
                        ["커피", FIXED_DRINK_PRICES.coffee],
                      ]} />
                    </S.OptionPriceInner>
                  </S.OptionPricePanel>
                </S.ProductCard>
              )})}
              {filteredProducts.length === 0 && <S.EmptyProducts>선택한 테마에 등록된 상품이 없습니다.</S.EmptyProducts>}
            </S.ProductList>
          </S.ProductSection>
          )}
        </S.Workspace>
      </S.Main>
      <Modal open={cancelModalOpen} title="상품을 취소할까요?" onClose={closeCancelModal} tone="warm">
        {cancelTarget && (
          <>
            <S.CancelProductSummary><strong>{cancelTarget.title}</strong><span>{cancelTarget.start} – {cancelTarget.end} · {cancelTarget.duration}</span><span>신청 {cancelTarget.applicants}명 / 최대 {cancelTarget.capacity}명</span></S.CancelProductSummary>
            <S.CancelProductWarning><FiAlertTriangle aria-hidden="true" /><span><strong>취소 후에는 다시 판매할 수 없어요.</strong></span></S.CancelProductWarning>
            <S.CancelProductActions><S.KeepProductButton type="button" onClick={closeCancelModal}>돌아가기</S.KeepProductButton><S.ConfirmProductCancelButton type="button" disabled={submitting} onClick={() => void cancelProduct()}>{submitting ? "취소 중..." : "상품 취소하기"}</S.ConfirmProductCancelButton></S.CancelProductActions>
          </>
        )}
      </Modal>
    </S.Page>
  );
}

async function loadProducts() {
  const products = await getStaffTravelProducts();
  const detailedProducts = await Promise.all(products.map(async (product) => {
    const detail = await getTravelProduct(product.travelProductId).catch(() => product);
    return toProduct({ ...product, ...detail, theme: product.theme }, API_TO_THEME[product.theme]);
  }));
  return sortProducts(detailedProducts);
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) =>
    Number(a.status === "CANCELLED") - Number(b.status === "CANCELLED")
    || a.start.localeCompare(b.start),
  );
}

async function loadInventoryQuantities() {
  const items = await getInventory();
  return items.reduce<Partial<Record<InventoryId, number>>>((quantities, item) => {
    quantities[INVENTORY_API_TO_ID[item.item]] = item.quantity;
    return quantities;
  }, {});
}

function toProduct(product: TravelProduct, fallbackTheme: ThemeId): Product {
  const themeId = product.theme ? API_TO_THEME[product.theme] : fallbackTheme;
  const start = product.departureDate.slice(0, 10);
  const end = product.returnDate.slice(0, 10);
  const requiresGrandOrHigher = themeId === "honeymoon" || themeId === "healing";
  const hotelPrice = requiresGrandOrHigher ? product.fourStarHotelPrice : product.threeStarHotelPrice;
  const mealPrice = requiresGrandOrHigher ? product.localRestaurantPrice : product.lunchPrice;
  const transportationPrice = themeId === "honeymoon" ? product.luxuryCarPrice : product.luxuryVanPrice;
  const priceParts = [product.baseServicePrice, hotelPrice, mealPrice, transportationPrice];
  const basicPrice = priceParts.every((price): price is number => typeof price === "number")
    ? priceParts.reduce((total, price) => total + price, 0)
    : undefined;
  return {
    id: String(product.travelProductId),
    themeId,
    title: themeInfo[themeId].title,
    code: `P-${start.slice(2).replaceAll("-", "")}-${themeInfo[themeId].code}`,
    start: toDisplayDate(start),
    end: toDisplayDate(end).slice(5),
    duration: durationBetween(start, end),
    price: basicPrice,
    applicants: product.currentParticipants,
    capacity: product.capacity,
    status: product.status,
    optionPrices: {
      baseService: product.baseServicePrice,
      threeStarHotel: product.threeStarHotelPrice,
      fourStarHotel: product.fourStarHotelPrice,
      fiveStarHotel: product.fiveStarHotelPrice,
      lunch: product.lunchPrice,
      localRestaurant: product.localRestaurantPrice,
      steak: product.steakPrice,
      luxuryCar: product.luxuryCarPrice,
      luxuryVan: product.luxuryVanPrice,
    },
  };
}

function PriceItem({ label, value }: { label: string; value?: number }) {
  return <div><span>{label}</span><strong>{formatOptionPrice(value)}</strong></div>;
}

function PriceGroup({ title, items }: { title: string; items: [string, number | undefined][] }) {
  return (
    <S.PriceGroup>
      <b>{title}</b>
      <div>{items.map(([label, value]) => <PriceItem key={label} label={label} value={value} />)}</div>
    </S.PriceGroup>
  );
}

function formatOptionPrice(value?: number) {
  if (typeof value !== "number") return "정보 없음";
  if (value === 0) return "+0원";
  return `+${currency.format(value)}원`;
}

function requiresGrandOrHigherTheme(themeId: ThemeId) {
  return themeId === "honeymoon" || themeId === "healing";
}
