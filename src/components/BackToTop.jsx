import { useScrollPosition } from '@/hooks/useScrollPosition'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { useLocale } from '@/context/LocaleContext'

export default function BackToTop() {
  const show = useScrollPosition(400)
  const { t, isRtl } = useLocale()

  if (!show) return null

  return (
    <Button
      className={`fixed bottom-6 z-50 rounded-full shadow-lg cursor-pointer ${isRtl ? 'left-6' : 'right-6'}`}
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backToTop')}
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
    </Button>
  )
}
