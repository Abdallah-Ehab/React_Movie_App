import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/context/LocaleContext'

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

export default function GenreFilter({ selected, onChange }) {
  const { t } = useLocale()

  function toggle(genreId) {
    const next = selected.includes(genreId)
      ? selected.filter((id) => id !== genreId)
      : [...selected, genreId]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const active = selected.includes(genre.id)
        return (
          <Badge
            key={genre.id}
            variant={active ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => toggle(genre.id)}
          >
            {t(`genres.${genre.id}`) || genre.name}
          </Badge>
        )
      })}
    </div>
  )
}
