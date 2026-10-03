import Home from './pages/home/HomePage'
import LoginPage from './pages/login/LoginPage'

/** Central route entrypoint. Add new top-level routes here as the app grows. */
export default function Router() {
  if (window.location.pathname.replace(/\/+$/, '') === '/login') {
    return <LoginPage />
  }
  return <Home />
}
