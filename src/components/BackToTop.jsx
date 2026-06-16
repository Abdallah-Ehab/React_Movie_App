import { useScrollPosition } from '@/hooks/useScrollPosition'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

export default function BackToTop() {
  const show = useScrollPosition(400)

  if (!show) return null

  return (
    <Button
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg cursor-pointer"
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-lg" />
    </Button>
  )
}
