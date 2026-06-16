import { useState, useEffect } from 'react'
import { tmdbFetch } from '@/lib/tmdb'

export function useMovies({ page = 1, sortBy, genreIds } = {}) {
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMovies() {
      setLoading(true)
      setError(null)

      try {
        const params = { page }

        if (sortBy && sortBy !== 'popularity.desc') {
          params.sort_by = sortBy
        }

        if (genreIds && genreIds.length > 0) {
          params.with_genres = genreIds.join(',')
        }

        const needsDiscover = params.sort_by || (genreIds && genreIds.length > 0)

        if (needsDiscover) {
          const today = new Date()
          const threeMonthsAgo = new Date(today)
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          const sixMonthsAgo = new Date(today)
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

          params['release_date.gte'] = sixMonthsAgo.toISOString().split('T')[0]
          params['release_date.lte'] = today.toISOString().split('T')[0]
          params['with_release_type'] = '1|2|3'

          const data = await tmdbFetch('/discover/movie', params)
          if (!cancelled) {
            setMovies(data.results || [])
            setTotalPages(Math.min(data.total_pages || 1, 500))
          }
        } else {
          const data = await tmdbFetch('/movie/now_playing', params)
          if (!cancelled) {
            setMovies(data.results || [])
            setTotalPages(Math.min(data.total_pages || 1, 500))
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setMovies([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMovies()

    return () => {
      cancelled = true
    }
  }, [page, sortBy, genreIds])

  return { movies, totalPages, loading, error }
}
