import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

export default function Account() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    document.title = 'Account | Movie App'
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Account</h1>
        <Card className="max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{user?.username || '-'}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Dark Mode</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="cursor-pointer"
              >
                {theme === 'light' ? 'Enable Dark' : 'Enable Light'}
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
