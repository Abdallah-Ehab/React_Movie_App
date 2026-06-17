import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '@/context/AuthContext'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Login | Movie App'
  }, [])

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">Movie App</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to your account
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A]"
            >
              {loading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              )}
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
