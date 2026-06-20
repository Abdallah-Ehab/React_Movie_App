import { useNavigate } from 'react-router-dom'
import HeartIcon from '@/components/HeartIcon'
import RatingMeter from './RatingMeter'
import { imageUrl } from '@/lib/tmdb'
import { useWishlist } from '@/context/WishlistContext'
import { useLocale } from '@/context/LocaleContext'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { t } = useLocale()
  const liked = isInWishlist(movie.id)

  return (
    <div
      className="group relative flex flex-col rounded-[19px] bg-card shadow-md ring-1 ring-foreground/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        <button
          className="absolute top-3 right-3 z-10 cursor-pointer drop-shadow-lg transition-transform duration-200 hover:scale-110"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(movie) }}
          aria-label={t('movie.favorite')}
        >
          <HeartIcon filled={liked} />
        </button>

        <div className="absolute bottom-3 left-3 z-10">
          <RatingMeter rating={movie.vote_average || 0} />
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 pb-4">
        <h3 className="text-sm font-semibold leading-tight truncate">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.release_date || t('common.tba')}
        </p>
      </div>
    </div>
  )
}
