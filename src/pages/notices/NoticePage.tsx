import * as Layout from "../themes/ThemeDetailPage.styles";
import * as S from "./NoticePage.styles";
import { notices } from "./notices";
import SiteFooter from "../../components/SiteFooter";

export default function NoticePage({ noticeId }: { noticeId: string }) {
  const noticeIndex = notices.findIndex((item) => item.id === noticeId);
  const notice = notices[noticeIndex];
  const previousNotice = notice ? notices[noticeIndex - 1] : undefined;
  const nextNotice = notice ? notices[noticeIndex + 1] : undefined;

  return (
    <S.Page>
      <Layout.Header>
        <Layout.Brand href="/">미스터 월드</Layout.Brand>
        <Layout.Nav aria-label="주 메뉴">
          <Layout.NavLink href="/#themes">THEME</Layout.NavLink>
          <Layout.NavLink href="/reservation">RESERVATION</Layout.NavLink>
          <Layout.NavLink href="/login">LOGIN</Layout.NavLink>
        </Layout.Nav>
      </Layout.Header>
      <S.Main>
        <S.Eyebrow>Notice</S.Eyebrow>
        <article>
          <S.ArticleHeader>
            <S.Title>{notice ? `[공지] ${notice.title}` : "공지를 찾을 수 없습니다"}</S.Title>
            {notice && (
              <S.Metadata>
                미스터 월드 · <time dateTime={notice.date.replaceAll(".", "-")}>{notice.date}</time>
              </S.Metadata>
            )}
          </S.ArticleHeader>
          <S.Body>
            {notice ? (
              notice.paragraphs.length > 0 ? (
                notice.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>상세 안내가 아직 등록되지 않았습니다.</p>
              )
            ) : (
              <p>요청하신 공지가 없습니다. 공지 목록에서 다시 확인해 주세요.</p>
            )}
          </S.Body>
        </article>
        {notice && (previousNotice || nextNotice) && (
          <S.ArticleNavigation aria-label="공지 글 이동">
            {previousNotice && (
              <S.NavigationRow>
                <strong>이전 글</strong>
                <S.ArticleLink href={`/notices/${previousNotice.id}`}>{previousNotice.title}</S.ArticleLink>
              </S.NavigationRow>
            )}
            {nextNotice && (
              <S.NavigationRow>
                <strong>다음 글</strong>
                <S.ArticleLink href={`/notices/${nextNotice.id}`}>{nextNotice.title}</S.ArticleLink>
              </S.NavigationRow>
            )}
          </S.ArticleNavigation>
        )}
      </S.Main>
      <SiteFooter />
    </S.Page>
  );
}
