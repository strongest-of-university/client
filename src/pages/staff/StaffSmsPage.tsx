import StaffHeader from "./StaffHeader";
import * as S from "./StaffSmsPage.styles";

const messages = [
  {
    sentAt: "2026-09-28 14:02",
    type: "출발 확정",
    recipients: "김정묵 외 1명 (4명)",
    content: "[미스터 월드] 골프 챌린지 투어 11/21 출발이 확정되었습니다.",
  },
  {
    sentAt: "2026-09-20 10:15",
    type: "취소 안내",
    recipients: "한지훈",
    content: "[미스터 월드] 아웃도어 트레킹 투어 10/10 예약이 취소되었습니다. 위약금 99,000원, 환불 891,000원.",
  },
  {
    sentAt: "2026-09-12 18:40",
    type: "확정 해제",
    recipients: "오민지 외 2명 (2명)",
    content: "[미스터 월드] 신청 인원 감소로 효도 힐링 투어 10/17 출발 확정이 해제되었습니다. 보상금 45,000원이 지급됩니다.",
  },
];

export default function StaffSmsPage() {
  return (
    <S.Page>
      <StaffHeader current="sms" />
      <S.Main>
        <S.Eyebrow>SMS</S.Eyebrow>
        <S.Title>문자 발송 내역</S.Title>
        <S.Description>출발 확정·확정 해제·취소 안내 문자 기록이에요.</S.Description>

        <S.MessageList>
          {messages.map((message) => (
            <S.MessageRow key={`${message.sentAt}-${message.type}`}>
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
        </S.MessageList>
      </S.Main>
    </S.Page>
  );
}
