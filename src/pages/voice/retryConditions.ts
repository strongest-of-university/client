import type { VoiceResponse } from "../../services/voiceService";

export function needsConditionChange(response: VoiceResponse): boolean {
  const message = response.productMessage ?? "";
  const asksToChange = /(?:날짜|일정|인원)/.test(message)
    && /(?:변경|바꿔|바꾸|조정|다른)/.test(message);
  const requested = response.draft.numberOfPeople;
  const products = response.products ?? [];
  const insufficientCapacity = requested != null && requested > 0 && products.length > 0
    && products.every((product) => Number.isFinite(product.remainingCapacity) && product.remainingCapacity < requested);
  return asksToChange || insufficientCapacity;
}
