import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import HeartIcon from '@/components/HeartIcon'
import MovieGrid from '@/components/movie/MovieGrid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useWishlist } from '@/context/WishlistContext'
import { imageUrl, tmdbFetch } from '@/lib/tmdb'

function formatRuntime(minutes) {
  if (!minutes) return 'Runtime unavailable'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (!hours) return `${mins}m`
  if (!mins) return `${hours}h`
  return `${hours}h ${mins}m`
}

function MovieDetailsSkeleton() {
  return (
    <>
      <div className="h-[350px] bg-muted" />
      <section className="px-8 py-10 max-w-[1400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <Skeleton className="aspect-[2/3] w-full max-w-[300px] rounded-[19px]" />
          <div className="space-y-5">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-4xl" />
              <Skeleton className="h-5 w-20 rounded-4xl" />
              <Skeleton className="h-5 w-14 rounded-4xl" />
            </div>
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </section>
    </>
  )
}

export default function MovieDetails() {
  const { id } = useParams()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [movie, setMovie] = useState(null)
  const [videos, setVideos] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMovie = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      tmdbFetch(`/movie/${id}`),
      tmdbFetch(`/movie/${id}/videos`),
      tmdbFetch(`/movie/${id}/recommendations`, { page: 1 }),
    ])
      .then(([details, videoData, recommendationData]) => {
        if (cancelled) return
        setMovie(details)
        setVideos(videoData.results || [])
        setRecommendations(recommendationData.results || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setMovie(null)
        setVideos([])
        setRecommendations([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => loadMovie(), [loadMovie])

  useEffect(() => {
    document.title = movie ? `${movie.title} | Movie App` : 'Movie Details | Movie App'
  }, [movie])

  const trailer = useMemo(
    () =>
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
      videos.find((video) => video.site === 'YouTube'),
    [videos],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <MovieDetailsSkeleton />
      </div>
    )
  }

  if (error) {
    const notFound = error.includes('404')

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="px-8 py-16 max-w-[900px] mx-auto text-center">
          <h1 className="text-3xl font-semibold mb-4">
            {notFound ? 'Movie not found' : 'Failed to load movie'}
          </h1>
          <p className="text-muted-foreground mb-6">{notFound ? 'We could not find that movie.' : error}</p>
          {!notFound && (
            <Button onClick={loadMovie} className="bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A]">
              Retry
            </Button>
          )}
        </section>
      </div>
    )
  }

  if (!movie) return null

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'
  const liked = isInWishlist(movie.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[350px] overflow-hidden">
        <img
          src={imageUrl(movie.backdrop_path, 'original')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 flex h-full items-end px-8 pb-10 max-w-[1400px] mx-auto">
          <div className="max-w-3xl text-white">
            <p className="text-sm text-white/70 mb-2">{releaseYear}</p>
            <h1 className="text-4xl font-semibold">{movie.title}</h1>
            {movie.tagline && <p className="mt-3 text-sm leading-relaxed text-white/80">{movie.tagline}</p>}
          </div>
        </div>
      </div>

      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <section className="grid gap-8 md:grid-cols-[300px_1fr]">
          <img
            src={imageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full max-w-[300px] aspect-[2/3] rounded-[19px] object-cover shadow-md"
          />

          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-3xl font-semibold mb-3">{movie.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{releaseYear}</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'} / 10</span>
              </div>
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {movie.overview || 'No overview is available for this movie.'}
            </p>

            <Button
              onClick={() => toggleWishlist(movie)}
              className="w-fit bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A]"
            >
              <HeartIcon filled={liked} />
              {liked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </section>

        {trailer && (
          <section className="mt-12">
            <h2 className="text-3xl font-semibold mb-6">Trailer</h2>
            <div className="aspect-video overflow-hidden rounded-[19px] bg-muted shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} trailer`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-semibold mb-6">Recommendations</h2>
            <MovieGrid movies={recommendations} />
          </section>
        )}
      </main>
    </div>
  )
}
