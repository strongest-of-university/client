import { useEffect, type ReactNode } from 'react'
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
import { useAuth } from './contexts/auth/authContext'

/** Central route entrypoint. Add new top-level routes here as the app grows. */
export default function Router() {
  const pathname = window.location.pathname.replace(/\/+$/, '')
  const { isStaff: staffAuthenticated, isCustomer: customerAuthenticated } = useAuth()

  if (pathname === '/staff/reservations') {
    return <RouteGuard allowed={staffAuthenticated} returnTo={pathname}><StaffReservationPage /></RouteGuard>
  }
  if (pathname === '/staff/stock') {
    return <RouteGuard allowed={staffAuthenticated} returnTo={pathname}><StaffStockPage /></RouteGuard>
  }
  if (pathname === '/staff/sms') {
    return <RouteGuard allowed={staffAuthenticated} returnTo={pathname}><StaffSmsPage /></RouteGuard>
  }
  if (pathname === '/staff') {
    return <RouteGuard allowed={staffAuthenticated} returnTo={pathname}><StaffPage /></RouteGuard>
  }

  if (pathname === '/mypage') {
    return <RouteGuard allowed={customerAuthenticated} returnTo={pathname}><MyPage /></RouteGuard>
  }
  if (pathname === '/voice') {
    return <RouteGuard allowed={customerAuthenticated} returnTo={pathname}><VoicePage /></RouteGuard>
  }
  if (pathname === '/booking') {
    return <RouteGuard allowed={customerAuthenticated} returnTo={pathname}><BookingPage /></RouteGuard>
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
    const returnTo = safeReturnTo(new URLSearchParams(window.location.search).get('redirect'))
    return <LoginPage returnTo={returnTo} reservationRequired={returnTo === '/voice' || returnTo === '/booking' || returnTo === '/reservation'} />
  }
  if (pathname === '/reservation') {
    return <RouteGuard allowed={customerAuthenticated} returnTo={pathname}><ReservationEntry /></RouteGuard>
  }
  if (pathname === '/themes/golf') {
    return <ThemeDetailPage key="golf" theme={golfTheme} />
  }
  if (pathname === '/themes/trekking') {
    return <ThemeDetailPage key="trekking" theme={trekkingTheme} />
  }
  return <Home />
}

function RouteGuard({ allowed, returnTo, children }: { allowed: boolean; returnTo: string; children: ReactNode }) {
  useEffect(() => {
    if (!allowed) {
      window.location.replace(`/login?redirect=${encodeURIComponent(returnTo)}`)
    }
  }, [allowed, returnTo])

  return allowed ? children : null
}

function ReservationEntry() {
  useEffect(() => {
    window.sessionStorage.setItem('showReservationOptions', 'true')
    window.location.replace('/')
  }, [])

  return null
}

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return undefined
  return value
}
