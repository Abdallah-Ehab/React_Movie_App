import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const app = (
  <AuthProvider clerkEnabled={Boolean(clerkPubKey)}>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {clerkPubKey ? (
          <ClerkProvider publishableKey={clerkPubKey}>{app}</ClerkProvider>
        ) : (
          app
        )}
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
