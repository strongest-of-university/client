import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { getNotifications } from "../../services/notificationService";
import StaffHeader from "./StaffHeader";
import * as S from "./StaffSmsPage.styles";

type SmsMessage = { id: string; sentAt: string; type: string; recipients: string; content: string };

export default function StaffSmsPage() {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [status, setStatus] = useState("문자 발송 내역을 불러오는 중입니다.");

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((notifications) => {
        if (!active) return;
        setMessages(notifications.map((notification, index) => ({
          id: String(notification.notificationId ?? index),
          sentAt: formatDateTime(notification.sentAt ?? notification.createdAt),
          type: notification.notificationType ?? notification.type ?? "안내",
          recipients: notification.recipients ?? notification.recipientName ?? "수신자",
          content: notification.content ?? notification.message ?? "발송 내용이 없습니다.",
        })));
        setStatus("");
      })
      .catch((error) => { if (active) setStatus(getErrorMessage(error)); });
    return () => { active = false; };
  }, []);

  return (
    <S.Page>
      <StaffHeader current="sms" />
      <S.Main>
        <S.Eyebrow>SMS</S.Eyebrow>
        <S.Title>문자 발송 내역</S.Title>
        <S.Description>출발 확정·확정 해제·취소 안내 문자 기록이에요.</S.Description>

        <S.MessageList>
          {messages.map((message) => (
            <S.MessageRow key={message.id}>
              <S.Meta>
                <time>{message.sentAt}</time>
                <S.Type>{message.type}</S.Type>
              </S.Meta>
              <S.MessageContent>
                <strong>{message.recipients}</strong>
                <p>{message.content}</p>
              </S.MessageContent>
            </S.MessageRow>
          ))}
          {status && <S.MessageRow><S.MessageContent><p>{status}</p></S.MessageContent></S.MessageRow>}
          {!status && messages.length === 0 && <S.MessageRow><S.MessageContent><p>문자 발송 내역이 없습니다.</p></S.MessageContent></S.MessageRow>}
        </S.MessageList>
      </S.Main>
    </S.Page>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "발송 시각 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
