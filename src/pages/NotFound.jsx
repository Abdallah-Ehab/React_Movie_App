import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/context/LocaleContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLocale()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">{t('notFound.message')}</p>
      <Button onClick={() => navigate('/')}>{t('notFound.goHome')}</Button>
    </div>
  )
}
