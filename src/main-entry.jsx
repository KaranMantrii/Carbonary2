import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Basic auto-refresh on update logic
    if (confirm("New content available. Reload?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {}
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
)
