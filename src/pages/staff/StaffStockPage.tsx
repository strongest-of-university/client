import { useState } from "react";
import StaffHeader from "./StaffHeader";
import { loadInventory, saveInventory, type Inventory, type InventoryId } from "./staffInventory";
import * as S from "./StaffStockPage.styles";

export default function StaffStockPage() {
  const [inventory, setInventory] = useState<Inventory>(loadInventory);
  const [pendingChanges, setPendingChanges] = useState<Partial<Record<InventoryId, number>>>({});
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

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

  function submitStockChanges() {
    if (!changeReady) return;
    const next = { ...inventory };
    (Object.entries(pendingChanges) as [InventoryId, number][]).forEach(([itemId, change]) => {
      if (!change) return;
      next[itemId] = { ...next[itemId], amount: Math.max(0, next[itemId].amount + change) };
    });
    setInventory(next);
    saveInventory(next);
    setPendingChanges({});
    setReason("");
    setMessage(`${changedItemCount}개 품목의 재고 변경이 제출되었습니다.`);
  }

  return (
    <S.Page>
      <StaffHeader current="stock" />
      <S.Main>
        <S.Eyebrow>STOCK</S.Eyebrow>
        <S.Title>창고 재고</S.Title>
        <S.Description>기념품과 추가 옵션 재고를 관리해요. 판매 중인 상품의 신청 인원으로 필요 수량을 계산해요.</S.Description>
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
          <S.SubmitChangesButton type="submit" disabled={!changeReady}>변경사항 제출</S.SubmitChangesButton>
        </S.SubmissionPanel>
        <S.Message role="status">{message}</S.Message>
      </S.Main>
    </S.Page>
  );
}
