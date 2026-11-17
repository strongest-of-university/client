import { createContext, useContext } from "react";
import type { VoiceDraft } from "../../services/voiceService";

export type BookingDraft = {
  travelProductId: number | null;
  voiceDraft: VoiceDraft | null;
};

export type BookingDraftContextValue = BookingDraft & {
  saveBookingDraft: (travelProductId: number, voiceDraft?: VoiceDraft) => void;
  consumeBookingDraft: () => BookingDraft;
  clearBookingDraft: () => void;
};

export const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function useBookingDraft() {
  const context = useContext(BookingDraftContext);
  if (!context) throw new Error("useBookingDraft must be used inside BookingDraftProvider.");
  return context;
}
