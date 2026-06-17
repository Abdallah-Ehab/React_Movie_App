import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import PrivateRoute from '@/components/layout/PrivateRoute'

const Wishlist = React.lazy(() => import('@/pages/Wishlist'))
const Account = React.lazy(() => import('@/pages/Account'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <Wishlist />
                </React.Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                  <Account />
                </React.Suspense>
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <NotFound />
              </React.Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  )
}
