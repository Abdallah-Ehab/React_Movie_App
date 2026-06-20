import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useLocale()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
