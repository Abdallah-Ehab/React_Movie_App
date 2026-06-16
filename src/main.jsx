import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { WishlistProvider } from './context/WishlistContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </ThemeProvider>
  </StrictMode>,
)
