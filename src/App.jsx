import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import MovieDetails from '@/pages/MovieDetails'
import PrivateRoute from '@/components/layout/PrivateRoute'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'

const Wishlist = React.lazy(() => import('@/pages/Wishlist'))
const Account = React.lazy(() => import('@/pages/Account'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))

function LoadingFallback() {
  const { t } = useLocale()
  return <div className="p-8 text-center">{t('common.loading')}</div>
}

function SsoCallback() {
  const { clerkEnabled } = useAuth()
  const { t } = useLocale()

  if (!clerkEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-8 text-center text-muted-foreground">
        {t('auth.oauthRequiresClerk')}
      </div>
    )
  }

  return <AuthenticateWithRedirectCallback />
}

export default function App() {
  const { direction } = useLocale()

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sso-callback" element={<SsoCallback />} />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <React.Suspense fallback={<LoadingFallback />}>
                  <Wishlist />
                </React.Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <React.Suspense fallback={<LoadingFallback />}>
                  <Account />
                </React.Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <React.Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </React.Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position={direction === 'rtl' ? 'top-left' : 'top-right'} richColors />
    </>
  )
}
