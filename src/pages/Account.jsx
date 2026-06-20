import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useLocale } from '@/context/LocaleContext'

export default function Account() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocale()

  useEffect(() => {
    document.title = t('account.pageTitle')
  }, [t])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold mb-6">{t('account.title')}</h1>
        <Card className="max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('account.profile')}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('account.email')}</p>
              <p className="font-medium">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('account.username')}</p>
              <p className="font-medium">{user?.username || '-'}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">{t('account.darkMode')}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="cursor-pointer"
              >
                {theme === 'light' ? t('account.enableDark') : t('account.enableLight')}
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={handleLogout}
            >
              {t('nav.logout')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
