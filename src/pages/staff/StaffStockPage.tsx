import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import {
  changeInventory,
  getInventory,
  getInventoryHistory,
  type InventoryApiItem,
  type InventoryHistoryPageResponse,
} from "../../services/inventoryService";
import StaffHeader from "./StaffHeader";
import { defaultInventory, type Inventory, type InventoryId } from "./staffInventory";
import * as S from "./StaffStockPage.styles";

export default function StaffStockPage() {
  const [activeView, setActiveView] = useState<"stock" | "history">("stock");
  const [inventory, setInventory] = useState<Inventory>(defaultInventory);
  const [inventoryStatus, setInventoryStatus] = useState<"loading" | "ready" | "error">("loading");
  const [inventoryError, setInventoryError] = useState("");
  const [historyPage, setHistoryPage] = useState<InventoryHistoryPageResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [pendingChanges, setPendingChanges] = useState<Partial<Record<InventoryId, number>>>({});
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getInventory()
      .then((items) => {
        if (!active) return;
        setInventory((current) => mergeInventory(current, items));
        setInventoryStatus("ready");
        setInventoryError("");
      })
      .catch((error) => {
        if (!active) return;
        setInventoryStatus("error");
        setInventoryError(getErrorMessage(error));
      });
    return () => { active = false; };
  }, []);

  const loadHistory = useCallback(async (page: number) => {
    setHistoryLoading(true);
    setHistoryError("");
    try {
      setHistoryPage(await getInventoryHistory(page));
    } catch (error) {
      setHistoryError(getErrorMessage(error));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  async function retryInventory() {
    setInventoryStatus("loading");
    setInventoryError("");
    try {
      const items = await getInventory();
      setInventory((current) => mergeInventory(current, items));
      setInventoryStatus("ready");
    } catch (error) {
      setInventoryStatus("error");
      setInventoryError(getErrorMessage(error));
    }
  }

  function stageStockChange(itemId: InventoryId, change: number) {
    setMessage("");
    setPendingChanges((current) => {
      const currentChange = current[itemId] ?? 0;
      const nextChange = currentChange + change;
      if (inventory[itemId].amount + nextChange < 0) return current;
      return { ...current, [itemId]: nextChange };
    });
  }

  const changedItemCount = Object.values(pendingChanges).filter((change) => change !== 0).length;
  const changeReady = changedItemCount > 0 && reason.trim().length > 0;

  async function submitStockChanges() {
    if (!changeReady) return;
    setSubmitting(true);
    setMessage("");
    const changes = (Object.entries(pendingChanges) as [InventoryId, number][]).filter(([, change]) => change !== 0);
    const results = await Promise.allSettled(changes.map(([itemId, change]) => {
      const apiItem = INVENTORY_ID_TO_API[itemId];
      return apiItem ? changeInventory(apiItem, change, reason.trim()) : Promise.reject(new Error("지원하지 않는 재고 품목입니다."));
    }));
    const successfulChanges = new Map<InventoryId, number>();
    const failedChanges: { itemId: InventoryId; error: unknown }[] = [];

    results.forEach((result, index) => {
      const [itemId, change] = changes[index];
      if (result.status === "fulfilled") successfulChanges.set(itemId, change);
      else failedChanges.push({ itemId, error: result.reason });
    });

    if (successfulChanges.size > 0) {
      setPendingChanges((current) => {
        const next = { ...current };
        successfulChanges.forEach((submittedChange, itemId) => {
          const remainingChange = (next[itemId] ?? 0) - submittedChange;
          if (remainingChange === 0) delete next[itemId];
          else next[itemId] = remainingChange;
        });
        return next;
      });
      await loadHistory(0);
    }

    try {
      const latestInventory = await getInventory();
      setInventory((current) => mergeInventory(current, latestInventory));
      setInventoryStatus("ready");
      setInventoryError("");
    } catch (error) {
      setInventoryStatus("error");
      setInventoryError(getErrorMessage(error));
    }

    if (failedChanges.length === 0) {
      setReason("");
      setMessage(`${successfulChanges.size}개 품목의 재고 변경이 제출되었습니다.`);
    } else {
      const failedNames = failedChanges.map(({ itemId }) => inventory[itemId].name).join(", ");
      const firstError = getErrorMessage(failedChanges[0].error);
      setMessage(`${successfulChanges.size}개 품목 변경 성공 · ${failedNames} 변경 실패: ${firstError}`);
    }
    setSubmitting(false);
  }

  return (
    <S.Page>
      <StaffHeader current="stock" />
      <S.Main>
        <S.Eyebrow>STOCK</S.Eyebrow>
        <S.Title>창고 재고</S.Title>
        <S.Description>기념품 재고를 관리해요. 상품을 등록하면 정원만큼 해당 테마의 기념품 재고가 차감돼요.</S.Description>
        <S.ViewTabs role="tablist" aria-label="재고 관리 메뉴">
          <S.ViewTab type="button" role="tab" aria-selected={activeView === "stock"} $selected={activeView === "stock"} onClick={() => setActiveView("stock")}>재고 현황</S.ViewTab>
          <S.ViewTab type="button" role="tab" aria-selected={activeView === "history"} $selected={activeView === "history"} onClick={() => {
            setActiveView("history");
            if (historyPage === null && !historyLoading) void loadHistory(0);
          }}>변경 이력</S.ViewTab>
        </S.ViewTabs>
        {activeView === "stock" ? inventoryStatus !== "ready" ? (
          <S.HistoryState>
            {inventoryStatus === "loading" ? "서버 재고를 불러오는 중입니다." : inventoryError}
            {inventoryStatus === "error" && <button type="button" onClick={() => void retryInventory()}>다시 시도</button>}
          </S.HistoryState>
        ) : <>
        <S.Grid>
          {Object.values(inventory).map((item) => {
            const pendingChange = pendingChanges[item.id] ?? 0;
            const displayedAmount = item.amount + pendingChange;
            return (
              <S.Card key={item.id}>
                <S.CardHeader><span><strong>{item.name}</strong><small>{item.description}</small></span></S.CardHeader>
                {pendingChange !== 0 ? (
                  <S.AmountChange aria-label={`${item.amount}${item.unit}에서 ${displayedAmount}${item.unit}로 변경`}>
                    <span><b>{item.amount}</b><small>{item.unit}</small></span>
                    <i>→</i>
                    <span className="next"><b>{displayedAmount}</b><small>{item.unit}</small></span>
                  </S.AmountChange>
                ) : <S.Amount><b>{displayedAmount}</b><span>{item.unit}</span></S.Amount>}
                <S.Actions>
                  <S.QuantityButton type="button" onClick={() => stageStockChange(item.id, -1)} aria-label={`${item.name} 재고 1개 출고`}>−</S.QuantityButton>
                  <S.QuantityButton type="button" onClick={() => stageStockChange(item.id, 1)} aria-label={`${item.name} 재고 1개 입고`}>+</S.QuantityButton>
                  <S.RestockButton type="button" onClick={() => stageStockChange(item.id, 10)}>입고 +10</S.RestockButton>
                </S.Actions>
              </S.Card>
            );
          })}
        </S.Grid>
        <S.SubmissionPanel onSubmit={(event) => { event.preventDefault(); submitStockChanges(); }}>
          <S.SubmissionHeader><span><strong>재고 변경 사유</strong><small>수량 변경 내용을 확인한 뒤 사유를 입력해 제출해 주세요.</small></span></S.SubmissionHeader>
          <S.ReasonField>
            <textarea value={reason} maxLength={255} placeholder="예: 기념품 신규 입고 및 파손 재고 조정" onChange={(event) => setReason(event.target.value)} required />
            <small>{reason.length}/255</small>
          </S.ReasonField>
          <S.SubmitChangesButton type="submit" disabled={!changeReady || submitting}>{submitting ? "제출 중..." : "변경사항 제출"}</S.SubmitChangesButton>
        </S.SubmissionPanel>
        <S.Message role="status">{message}</S.Message>
        </> : (
          <S.HistorySection>
            <S.HistoryHeading>
              <span><strong>재고 변경 이력</strong><small>품목별 입출고 수량과 변경 사유를 확인할 수 있어요.</small></span>
            </S.HistoryHeading>
            <S.HistoryTableWrap>
              {historyLoading ? <S.HistoryState>변경 이력을 불러오는 중입니다.</S.HistoryState> : historyError ? (
                <S.HistoryState>{historyError}<button type="button" onClick={() => void loadHistory(historyPage?.currentPage ?? 0)}>다시 시도</button></S.HistoryState>
              ) : !historyPage?.histories.length ? <S.HistoryState>아직 재고 변경 이력이 없습니다.</S.HistoryState> : <S.HistoryTable>
                <thead><tr><th>변경 일시</th><th>품목</th><th>구분</th><th>수량 변경</th><th>변경 사유</th></tr></thead>
                <tbody>
                  {historyPage.histories.map((entry) => {
                    const beforeQuantity = entry.quantityAfter - entry.changeQuantity;
                    const changeLabel = CHANGE_TYPE_LABEL[entry.changeType];
                    const unit = INVENTORY_UNIT[entry.item];
                    return <tr key={entry.historyId}>
                      <td data-label="변경 일시">{formatHistoryDate(entry.createdAt)}</td>
                      <td data-label="품목"><strong>{entry.itemName}</strong></td>
                      <td data-label="구분"><S.ChangeBadge $inbound={entry.changeType === "INBOUND"}>{changeLabel}</S.ChangeBadge></td>
                      <td data-label="수량 변경"><S.QuantityChange><span>{beforeQuantity}{unit}</span><i>→</i><strong>{entry.quantityAfter}{unit}</strong></S.QuantityChange></td>
                      <td data-label="변경 사유">{entry.reason}</td>
                    </tr>;
                  })}
                </tbody>
              </S.HistoryTable>}
            </S.HistoryTableWrap>
            {historyPage && historyPage.totalPages > 1 && (
              <S.Pagination aria-label="재고 변경 이력 페이지">
                <button type="button" disabled={!historyPage.hasPrevious || historyLoading} onClick={() => void loadHistory(historyPage.currentPage - 1)}>이전</button>
                <span>{historyPage.currentPage + 1} / {historyPage.totalPages}</span>
                <button type="button" disabled={!historyPage.hasNext || historyLoading} onClick={() => void loadHistory(historyPage.currentPage + 1)}>다음</button>
              </S.Pagination>
            )}
          </S.HistorySection>
        )}
      </S.Main>
    </S.Page>
  );
}

const INVENTORY_ID_TO_API: Partial<Record<InventoryId, InventoryApiItem>> = {
  "couple-shirt": "COUPLE_TSHIRT",
  ginseng: "GINSENG",
  "golf-ball": "GOLF_BALL",
  scarf: "SCARF",
};

const API_TO_INVENTORY_ID: Record<InventoryApiItem, InventoryId> = {
  COUPLE_TSHIRT: "couple-shirt",
  GINSENG: "ginseng",
  GOLF_BALL: "golf-ball",
  SCARF: "scarf",
};

function mergeInventory(current: Inventory, items: Awaited<ReturnType<typeof getInventory>>) {
  const next = { ...current };
  items.forEach((item) => {
    const itemId = API_TO_INVENTORY_ID[item.item];
    if (itemId) next[itemId] = { ...next[itemId], name: item.itemName, amount: item.quantity };
  });
  return next;
}

function formatHistoryDate(value: string) {
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const date = new Date(hasTimeZone ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(date);
}

const INVENTORY_UNIT: Record<InventoryApiItem, string> = {
  COUPLE_TSHIRT: "벌",
  GINSENG: "박스",
  GOLF_BALL: "개",
  SCARF: "장",
};

const CHANGE_TYPE_LABEL = {
  INBOUND: "입고",
  OUTBOUND: "출고",
  ADJUSTMENT: "정정",
} as const;
