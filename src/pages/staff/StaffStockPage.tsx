import { useState } from "react";
import StaffHeader from "./StaffHeader";
import { loadInventory, saveInventory, type Inventory, type InventoryId } from "./staffInventory";
import * as S from "./StaffStockPage.styles";

export default function StaffStockPage() {
  const [inventory, setInventory] = useState<Inventory>(loadInventory);

  function changeStock(id: InventoryId, change: number) {
    setInventory((current) => {
      const next = {
        ...current,
        [id]: { ...current[id], amount: Math.max(0, current[id].amount + change) },
      };
      saveInventory(next);
      return next;
    });
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
            const shortage = item.amount < item.safeStock;
            return (
              <S.Card key={item.id} $shortage={shortage}>
                <S.CardHeader><span><strong>{item.name}</strong><small>{item.description}</small></span><S.Badge $shortage={shortage}>{shortage ? "재고 부족" : "충분"}</S.Badge></S.CardHeader>
                <S.Amount><b>{item.amount}</b><span>{item.unit}</span></S.Amount>
                <S.StockInfo><div><span>안전 재고</span><strong>{item.safeStock}{item.unit}</strong></div><div><span>출발 예정 필요 수량</span><strong>{item.needed}</strong></div></S.StockInfo>
                <S.Actions>
                  <S.QuantityButton type="button" onClick={() => changeStock(item.id, -1)} aria-label={`${item.name} 재고 1개 감소`}>−</S.QuantityButton>
                  <S.QuantityButton type="button" onClick={() => changeStock(item.id, 1)} aria-label={`${item.name} 재고 1개 증가`}>+</S.QuantityButton>
                  <S.RestockButton type="button" onClick={() => changeStock(item.id, 10)}>입고 +10</S.RestockButton>
                </S.Actions>
              </S.Card>
            );
          })}
        </S.Grid>
      </S.Main>
    </S.Page>
  );
}
