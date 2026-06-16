import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  function goTo(p) {
    if (p >= 1 && p <= totalPages) onPageChange(p)
  }

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Button
        variant="ghost"
        size="icon"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="cursor-pointer"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
      </Button>

      {start > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goTo(1)}
            className="cursor-pointer"
          >
            1
          </Button>
          {start > 2 && <span className="text-muted-foreground">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'default' : 'ghost'}
          size="icon"
          onClick={() => goTo(p)}
          className={`w-[41px] h-[41px] rounded-[5px] cursor-pointer ${
            p === page ? 'bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A]' : ''
          }`}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted-foreground">...</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goTo(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="cursor-pointer"
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
      </Button>
    </div>
  )
}
