import { apiRequest } from "../api/client";
import type { ThemeCode, TravelProduct } from "./travelProductService";

export type VoiceDraft = {
  theme?: ThemeCode | null;
  departureFrom?: string | null;
  departureBefore?: string | null;
  numberOfPeople?: number | null;
  tourLevel?: "CLASSIC" | "GRAND" | "PREMIUM" | null;
  selectedHotel?: number | null;
  selectedTransportation?: number | null;
  selectedMeal?: number | null;
  selectedDrink?: number | null;
};

export type VoiceResponse = {
  transcript?: string;
  draft: VoiceDraft;
  followUpQuestion?: string | null;
  productMessage?: string | null;
  products?: TravelProduct[];
  validationMessages?: string[];
  fieldsComplete?: boolean;
};

export type VoiceContext = { draft: VoiceDraft; lastQuestion?: string | null };

export function sendVoiceText(text: string, context: VoiceContext) {
  return apiRequest<VoiceResponse>("/api/v1/voice/text", { method: "POST", body: JSON.stringify({ text, context }) }, 60_000);
}

export function sendVoiceAudio(audio: Blob, context: VoiceContext) {
  const form = new FormData();
  const type = audio.type.toLowerCase();
  const extension = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : type.includes("wav") ? "wav" : "webm";
  form.append("file", audio, `recording.${extension}`);
  form.append("context", new Blob([JSON.stringify(context)], { type: "application/json" }));
  return apiRequest<VoiceResponse>("/api/v1/voice/process", { method: "POST", body: form }, 60_000);
}
