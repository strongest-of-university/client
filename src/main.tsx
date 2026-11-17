import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router.tsx'
import { AuthProvider } from './contexts/auth/AuthProvider.tsx'
import { BookingDraftProvider } from './contexts/booking/BookingDraftProvider.tsx'
import { GlobalStyle } from './styles/globalStyles.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <AuthProvider>
      <BookingDraftProvider>
        <Router />
      </BookingDraftProvider>
    </AuthProvider>
  </StrictMode>,
)
