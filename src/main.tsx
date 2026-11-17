import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router.tsx'
import { AuthProvider } from './contexts/auth/AuthProvider.tsx'
import { BookingDraftProvider } from './contexts/booking/BookingDraftProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BookingDraftProvider>
        <Router />
      </BookingDraftProvider>
    </AuthProvider>
  </StrictMode>,
)
