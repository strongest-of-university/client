import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { changeInventory, getInventory, type InventoryApiItem } from "../../api/services";
import StaffHeader from "./StaffHeader";
import { loadInventory, saveInventory, type Inventory, type InventoryId } from "./staffInventory";
import * as S from "./StaffStockPage.styles";

type StockHistory = {
  id: number;
  changedAt: string;
  itemName: string;
  unit: string;
  beforeQuantity: number;
  afterQuantity: number;
  changeType: "입고" | "출고";
  reason: string;
};

export default function StaffStockPage() {
  const [activeView, setActiveView] = useState<"stock" | "history">("stock");
  const [inventory, setInventory] = useState<Inventory>(loadInventory);
  const [history, setHistory] = useState<StockHistory[]>(SAMPLE_HISTORY);
  const [pendingChanges, setPendingChanges] = useState<Partial<Record<InventoryId, number>>>({});
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getInventory()
      .then((items) => {
        if (!active) return;
        setInventory((current) => {
          const next = { ...current };
          items.forEach((item) => {
            const itemId = API_TO_INVENTORY_ID[item.item];
            if (itemId) next[itemId] = { ...next[itemId], amount: item.quantity };
          });
          saveInventory(next);
          return next;
        });
      })
      .catch((error) => {
        if (active) setMessage(`재고를 불러오지 못했습니다. ${getErrorMessage(error)}`);
      });
    return () => { active = false; };
  }, []);

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
    try {
      await Promise.all(changes.map(([itemId, change]) => {
        const apiItem = INVENTORY_ID_TO_API[itemId];
        return apiItem ? changeInventory(apiItem, change, reason.trim()) : Promise.resolve();
      }));

      const next = { ...inventory };
      changes.forEach(([itemId, change]) => {
        next[itemId] = { ...next[itemId], amount: Math.max(0, next[itemId].amount + change) };
      });
      const submittedAt = formatHistoryDate(new Date());
      setHistory((current) => [
        ...changes.map(([itemId, change], index) => ({
          id: Date.now() + index,
          changedAt: submittedAt,
          itemName: inventory[itemId].name,
          unit: inventory[itemId].unit,
          beforeQuantity: inventory[itemId].amount,
          afterQuantity: Math.max(0, inventory[itemId].amount + change),
          changeType: (change > 0 ? "입고" : "출고") as "입고" | "출고",
          reason: reason.trim(),
        })),
        ...current,
      ]);
      setInventory(next);
      saveInventory(next);
      setPendingChanges({});
      setReason("");
      setMessage(`${changedItemCount}개 품목의 재고 변경이 제출되었습니다.`);
    } catch (error) {
      setMessage(getErrorMessage(error));
      getInventory().then((items) => {
        setInventory((current) => {
          const next = { ...current };
          items.forEach((item) => {
            const itemId = API_TO_INVENTORY_ID[item.item];
            if (itemId) next[itemId] = { ...next[itemId], amount: item.quantity };
          });
          saveInventory(next);
          return next;
        });
      }).catch(() => undefined);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <S.Page>
      <StaffHeader current="stock" />
      <S.Main>
        <S.Eyebrow>STOCK</S.Eyebrow>
        <S.Title>창고 재고</S.Title>
        <S.Description>기념품과 추가 옵션 재고를 관리해요. 판매 중인 상품의 신청 인원으로 필요 수량을 계산해요.</S.Description>
        <S.ViewTabs role="tablist" aria-label="재고 관리 메뉴">
          <S.ViewTab type="button" role="tab" aria-selected={activeView === "stock"} $selected={activeView === "stock"} onClick={() => setActiveView("stock")}>재고 현황</S.ViewTab>
          <S.ViewTab type="button" role="tab" aria-selected={activeView === "history"} $selected={activeView === "history"} onClick={() => setActiveView("history")}>변경 이력</S.ViewTab>
        </S.ViewTabs>
        {activeView === "stock" ? <>
        <S.Grid>
          {Object.values(inventory).map((item) => {
            const pendingChange = pendingChanges[item.id] ?? 0;
            const displayedAmount = item.amount + pendingChange;
            const shortage = displayedAmount < item.safeStock;
            return (
              <S.Card key={item.id} $shortage={shortage}>
                <S.CardHeader><span><strong>{item.name}</strong><small>{item.description}</small></span><S.Badge $shortage={shortage}>{shortage ? "재고 부족" : "충분"}</S.Badge></S.CardHeader>
                {pendingChange !== 0 ? (
                  <S.AmountChange aria-label={`${item.amount}${item.unit}에서 ${displayedAmount}${item.unit}로 변경`}>
                    <span><b>{item.amount}</b><small>{item.unit}</small></span>
                    <i>→</i>
                    <span className="next"><b>{displayedAmount}</b><small>{item.unit}</small></span>
                  </S.AmountChange>
                ) : <S.Amount><b>{displayedAmount}</b><span>{item.unit}</span></S.Amount>}
                <S.StockInfo><div><span>안전 재고</span><strong>{item.safeStock}{item.unit}</strong></div><div><span>출발 예정 필요 수량</span><strong>{item.needed}</strong></div></S.StockInfo>
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
          <S.SubmissionHeader><span><strong>재고 변경 사유</strong><small>수량 변경 내용을 확인한 뒤 사유를 입력해 제출해 주세요.</small></span><b>{changedItemCount}개 품목 변경</b></S.SubmissionHeader>
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
              <b>총 {history.length}건</b>
            </S.HistoryHeading>
            <S.HistoryTableWrap>
              <S.HistoryTable>
                <thead><tr><th>변경 일시</th><th>품목</th><th>구분</th><th>수량 변경</th><th>변경 사유</th></tr></thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id}>
                      <td data-label="변경 일시">{entry.changedAt}</td>
                      <td data-label="품목"><strong>{entry.itemName}</strong></td>
                      <td data-label="구분"><S.ChangeBadge $inbound={entry.changeType === "입고"}>{entry.changeType}</S.ChangeBadge></td>
                      <td data-label="수량 변경"><S.QuantityChange><span>{entry.beforeQuantity}{entry.unit}</span><i>→</i><strong>{entry.afterQuantity}{entry.unit}</strong></S.QuantityChange></td>
                      <td data-label="변경 사유">{entry.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </S.HistoryTable>
            </S.HistoryTableWrap>
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

function formatHistoryDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hour}:${minute}`;
}

const SAMPLE_HISTORY: StockHistory[] = [
  { id: 1, changedAt: "2026.11.09 10:24", itemName: "커플 기념티", unit: "벌", beforeQuantity: 14, afterQuantity: 24, changeType: "입고", reason: "11월 신규 기념품 입고" },
  { id: 2, changedAt: "2026.11.08 16:40", itemName: "건강 인삼", unit: "박스", beforeQuantity: 8, afterQuantity: 6, changeType: "출고", reason: "효도 힐링 투어 출발 상품 준비" },
  { id: 3, changedAt: "2026.11.07 09:15", itemName: "아웃도어 스카프", unit: "장", beforeQuantity: 25, afterQuantity: 35, changeType: "입고", reason: "부족 재고 추가 입고" },
];
