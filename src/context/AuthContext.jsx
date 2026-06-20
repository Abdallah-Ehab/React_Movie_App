import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { toast } from 'sonner'

const AuthContext = createContext(null)
const OAUTH_PROVIDERS = [
  { id: 'google', strategy: 'oauth_google' },
  { id: 'github', strategy: 'oauth_github' },
]

function createLocalUser(email, username) {
  return { email, username: username || email.split('@')[0] }
}

function LocalAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth:user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth:user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth:user')
    }
  }, [user])

  const login = useCallback(async (email, password) => {
    setActionLoading(true)
    setError(null)
    try {
      const nextUser = createLocalUser(email)
      setUser(nextUser)
      toast.success('Welcome back!')
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }, [])

  const register = useCallback(async (email, username, password) => {
    setActionLoading(true)
    setError(null)
    try {
      const nextUser = createLocalUser(email, username)
      setUser(nextUser)
      toast.success('Account created!')
    } catch (err) {
      const message = err.message || 'Registration failed'
      setError(message)
      toast.error(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    toast.success('Logged out')
  }, [])

  const startLocalOAuth = useCallback(async () => {
    const message = 'OAuth sign-in requires Clerk to be configured.'
    setError(message)
    toast.error(message)
    throw new Error(message)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginWithOAuth: startLocalOAuth,
        registerWithOAuth: startLocalOAuth,
        oauthProviders: OAUTH_PROVIDERS,
        clerkEnabled: false,
        loading: actionLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function ClerkAuthProvider({ children }) {
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
        username: clerkUser.username || clerkUser.fullName || '',
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

  const startOAuth = useCallback(async (strategy, mode = 'signIn') => {
    setActionLoading(true)
    setError(null)
    try {
      const resource = mode === 'signUp' ? clerk.client.signUp : clerk.client.signIn
      await resource.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
      setActionLoading(false)
    } catch (err) {
      const message = err.errors?.[0]?.message || err.message || 'OAuth sign-in failed'
      setError(message)
      toast.error(message)
      setActionLoading(false)
      throw new Error(message)
    }
  }, [clerk])

  const loginWithOAuth = useCallback((strategy) => startOAuth(strategy, 'signIn'), [startOAuth])
  const registerWithOAuth = useCallback((strategy) => startOAuth(strategy, 'signUp'), [startOAuth])

  const logout = useCallback(() => {
    clerk.signOut()
    setUser(null)
    setError(null)
    toast.success('Logged out')
  }, [clerk])

  const loading = !isLoaded || actionLoading

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loginWithOAuth,
        registerWithOAuth,
        oauthProviders: OAUTH_PROVIDERS,
        clerkEnabled: true,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children, clerkEnabled = true }) {
  if (!clerkEnabled) {
    return <LocalAuthProvider>{children}</LocalAuthProvider>
  }

  return <ClerkAuthProvider>{children}</ClerkAuthProvider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
