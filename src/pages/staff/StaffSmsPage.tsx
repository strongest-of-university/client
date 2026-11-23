import { useEffect, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { getNotifications, type NotificationPage } from "../../services/notificationService";
import StaffHeader from "../../components/StaffHeader";
import * as S from "./StaffSmsPage.styles";

type SmsMessage = { id: string; sentAt: string; type: string; recipients: string; content: string };

export default function StaffSmsPage() {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [status, setStatus] = useState("문자 발송 내역을 불러오는 중입니다.");
  const [page, setPage] = useState(0);
  const [notificationPage, setNotificationPage] = useState<NotificationPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getNotifications(page)
      .then((result) => {
        if (!active) return;
        setNotificationPage(result);
        setMessages(result.notifications.map((notification, index) => ({
          id: String(notification.notificationId ?? index),
          sentAt: formatDateTime(notification.sentAt ?? notification.createdAt),
          type: notification.notificationType ?? notification.type ?? "안내",
          recipients: notification.userName ?? notification.recipientName ?? notification.recipients ?? "수신자",
          content: notification.content ?? notification.message ?? "발송 내용이 없습니다.",
        })));
        setStatus("");
      })
      .catch((error) => { if (active) setStatus(getErrorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  function movePage(nextPage: number) {
    setLoading(true);
    setStatus("문자 발송 내역을 불러오는 중입니다.");
    setPage(nextPage);
  }

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
        {notificationPage && (notificationPage.hasPrevious || notificationPage.hasNext || (notificationPage.totalPages ?? 0) > 1) && (
          <S.Pagination aria-label="문자 발송 내역 페이지">
            <button type="button" disabled={!notificationPage.hasPrevious || loading} onClick={() => movePage(notificationPage.currentPage - 1)}>이전</button>
            <span>{notificationPage.currentPage + 1}{notificationPage.totalPages ? ` / ${notificationPage.totalPages}` : ""}</span>
            <button type="button" disabled={!notificationPage.hasNext || loading} onClick={() => movePage(notificationPage.currentPage + 1)}>다음</button>
          </S.Pagination>
        )}
      </S.Main>
    </S.Page>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "발송 시각 없음";
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const date = new Date(hasTimeZone ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" }).format(date);
}
