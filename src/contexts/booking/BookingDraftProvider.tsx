import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import type { VoiceDraft } from "../../services/voiceService";
import { BookingDraftContext, type BookingDraft, type BookingDraftContextValue } from "./bookingDraftContext";

const PRODUCT_KEY = "selectedTravelProductId";
const VOICE_DRAFT_KEY = "voiceBookingDraft";

function readBookingDraft(): BookingDraft {
  const storedProductId = Number(window.sessionStorage.getItem(PRODUCT_KEY));
  let voiceDraft: VoiceDraft | null = null;
  const storedVoiceDraft = window.sessionStorage.getItem(VOICE_DRAFT_KEY);
  if (storedVoiceDraft) {
    try {
      voiceDraft = JSON.parse(storedVoiceDraft) as VoiceDraft;
    } catch {
      window.sessionStorage.removeItem(VOICE_DRAFT_KEY);
    }
  }
  return {
    travelProductId: Number.isInteger(storedProductId) && storedProductId > 0 ? storedProductId : null,
    voiceDraft,
  };
}

function clearStoredDraft() {
  window.sessionStorage.removeItem(PRODUCT_KEY);
  window.sessionStorage.removeItem(VOICE_DRAFT_KEY);
}

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(readBookingDraft);
  const draftRef = useRef(draft);

  const saveBookingDraft = useCallback((travelProductId: number, voiceDraft?: VoiceDraft) => {
    const next = { travelProductId, voiceDraft: voiceDraft ?? null };
    window.sessionStorage.setItem(PRODUCT_KEY, String(travelProductId));
    if (voiceDraft) window.sessionStorage.setItem(VOICE_DRAFT_KEY, JSON.stringify(voiceDraft));
    else window.sessionStorage.removeItem(VOICE_DRAFT_KEY);
    draftRef.current = next;
    setDraft(next);
  }, []);

  const clearBookingDraft = useCallback(() => {
    const empty = { travelProductId: null, voiceDraft: null };
    clearStoredDraft();
    draftRef.current = empty;
    setDraft(empty);
  }, []);

  const consumeBookingDraft = useCallback(() => {
    const current = draftRef.current;
    clearStoredDraft();
    const empty = { travelProductId: null, voiceDraft: null };
    draftRef.current = empty;
    setDraft(empty);
    return current;
  }, []);

  const value = useMemo<BookingDraftContextValue>(() => ({
    ...draft,
    saveBookingDraft,
    consumeBookingDraft,
    clearBookingDraft,
  }), [draft, saveBookingDraft, consumeBookingDraft, clearBookingDraft]);

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}
