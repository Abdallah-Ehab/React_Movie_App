import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { toast } from 'sonner'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const clerk = useClerk()

  const [user, setUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn && clerkUser) {
      setUser({
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        username: clerkUser.username || '',
      })
      setError(null)
    } else {
      setUser(null)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const login = useCallback(async (email, password) => {
    setActionLoading(true)
    setError(null)
    try {
      if (!email || !email.includes('@')) throw new Error('Invalid email')
      if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')

      const signInResponse = await clerk.client.signIn.create({
        identifier: email,
        password,
      })

      if (signInResponse.status !== 'complete') {
        throw new Error('Login failed')
      }

      await clerk.setActive({ session: signInResponse.createdSessionId })
      toast.success('Welcome back!')
    } catch (err) {
      const message = err.errors?.[0]?.message || err.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }, [clerk])

  const register = useCallback(async (email, username, password) => {
    setActionLoading(true)
    setError(null)
    try {
      if (!email || !email.includes('@')) throw new Error('Invalid email')
      if (!username || username.length < 3) throw new Error('Username must be at least 3 characters')
      if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')

      const signUpResponse = await clerk.client.signUp.create({
        emailAddress: email,
        username,
        password,
      })

      if (signUpResponse.status === 'complete') {
        await clerk.setActive({ session: signUpResponse.createdSessionId })
        toast.success('Account created!')
      } else {
        throw new Error('Registration requires additional steps')
      }
    } catch (err) {
      const message = err.errors?.[0]?.message || err.message || 'Registration failed'
      setError(message)
      toast.error(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }, [clerk])

  const logout = useCallback(() => {
    clerk.signOut()
    setUser(null)
    setError(null)
    toast.success('Logged out')
  }, [clerk])

  const loading = !isLoaded || actionLoading

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
