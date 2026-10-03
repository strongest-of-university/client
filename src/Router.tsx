import Home from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'
import ThemeDetailPage from './pages/themes/ThemeDetailPage'
import { golfTheme, healingTheme, honeymoonTheme, trekkingTheme } from './pages/themes/themeDetails'

/** Central route entrypoint. Add new top-level routes here as the app grows. */
export default function Router() {
  if (window.location.pathname.replace(/\/+$/, '') === '/themes/honeymoon') {
    return <ThemeDetailPage key="honeymoon" theme={honeymoonTheme} />
  }
  if (window.location.pathname.replace(/\/+$/, '') === '/themes/healing') {
    return <ThemeDetailPage key="healing" theme={healingTheme} />
  }
  if (window.location.pathname.replace(/\/+$/, '') === '/login') {
    return <LoginPage />
  }
  if (window.location.pathname.replace(/\/+$/, '') === '/themes/golf') {
    return <ThemeDetailPage key="golf" theme={golfTheme} />
  }
  if (window.location.pathname.replace(/\/+$/, '') === '/themes/trekking') {
    return <ThemeDetailPage key="trekking" theme={trekkingTheme} />
  }
  return <Home />
}
