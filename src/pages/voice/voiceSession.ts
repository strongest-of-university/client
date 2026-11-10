import type { TravelProduct } from "../../api/services";
import type { VoiceContext } from "../../api/voice";

export const VOICE_SESSION_KEY = "voiceReservationConversation";
export type Message = { role: "assistant" | "user"; text: string };
export type VoiceConversation = {
  messages: Message[];
  context: VoiceContext;
  products: TravelProduct[];
  needsRetry: boolean;
};

export function readVoiceConversation(storage: Storage): VoiceConversation | null {
  try {
    const value: unknown = JSON.parse(storage.getItem(VOICE_SESSION_KEY) ?? "null");
    if (!value || typeof value !== "object") return null;
    const saved = value as VoiceConversation;
    if (!Array.isArray(saved.messages) || !saved.messages.length
      || !saved.messages.every((message) => message && (message.role === "assistant" || message.role === "user") && typeof message.text === "string")
      || !saved.context || !saved.context.draft || typeof saved.context.draft !== "object"
      || !Array.isArray(saved.products) || typeof saved.needsRetry !== "boolean") return null;
    return saved;
  } catch {
    return null;
  }
}

export function writeVoiceConversation(storage: Storage, conversation: VoiceConversation): void {
  try { storage.setItem(VOICE_SESSION_KEY, JSON.stringify(conversation)); } catch { /* The conversation remains available in memory. */ }
}
