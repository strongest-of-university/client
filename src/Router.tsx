import Home from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import SignupPage from './pages/signup/SignupPage'
import MyPage from './pages/mypage/MyPage'
import BookingPage from './pages/booking/BookingPage'
import VoicePage from './pages/voice/VoicePage'
import NoticePage from './pages/notices/NoticePage'
import ThemeDetailPage from './pages/themes/ThemeDetailPage'
import StaffPage from './pages/staff/StaffPage'
import StaffReservationPage from './pages/staff/StaffReservationPage'
import StaffStockPage from './pages/staff/StaffStockPage'
import StaffSmsPage from './pages/staff/StaffSmsPage'
import { golfTheme, healingTheme, honeymoonTheme, trekkingTheme } from './pages/themes/themeDetails'
import { getAccessToken } from './api/client'

/** Central route entrypoint. Add new top-level routes here as the app grows. */
export default function Router() {
  const pathname = window.location.pathname.replace(/\/+$/, '')
  const authenticated = Boolean(getAccessToken())
  const staffAuthenticated = authenticated && window.sessionStorage.getItem('isStaff') === 'true'
  const customerAuthenticated = authenticated && window.sessionStorage.getItem('isLoggedIn') === 'true'

  if (pathname === '/staff/reservations') {
    return staffAuthenticated ? <StaffReservationPage /> : <LoginPage />
  }
  if (pathname === '/staff/stock') {
    return staffAuthenticated ? <StaffStockPage /> : <LoginPage />
  }
  if (pathname === '/staff/sms') {
    return staffAuthenticated ? <StaffSmsPage /> : <LoginPage />
  }
  if (pathname === '/staff') {
    return staffAuthenticated ? <StaffPage /> : <LoginPage />
  }

  if (pathname === '/mypage') {
    return customerAuthenticated ? <MyPage /> : <LoginPage />
  }
  if (pathname === '/voice') {
    return customerAuthenticated ? <VoicePage /> : <LoginPage reservationRequired />
  }
  if (pathname === '/booking') {
    return customerAuthenticated ? <BookingPage /> : <LoginPage reservationRequired />
  }
  if (pathname === '/signup') {
    return <SignupPage />
  }
  const noticeMatch = window.location.pathname.match(/^\/notices\/([^/]+)\/?$/)
  if (noticeMatch) {
    return <NoticePage noticeId={noticeMatch[1]} />
  }
  if (pathname === '/themes/honeymoon') {
    return <ThemeDetailPage key="honeymoon" theme={honeymoonTheme} />
  }
  if (pathname === '/themes/healing') {
    return <ThemeDetailPage key="healing" theme={healingTheme} />
  }
  if (pathname === '/login') {
    return <LoginPage />
  }
  if (pathname === '/reservation') {
    return <LoginPage reservationRequired />
  }
  if (pathname === '/themes/golf') {
    return <ThemeDetailPage key="golf" theme={golfTheme} />
  }
  if (pathname === '/themes/trekking') {
    return <ThemeDetailPage key="trekking" theme={trekkingTheme} />
  }
  return <Home />
}
