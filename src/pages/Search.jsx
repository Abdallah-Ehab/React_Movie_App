import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import MovieGrid from '@/components/movie/MovieGrid'
import MovieGridSkeleton from '@/components/movie/MovieGridSkeleton'
import Pagination from '@/components/Pagination'
import { tmdbFetch } from '@/lib/tmdb'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('query') || ''
  const parsedPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.min(Math.max(parsedPage, 1), 500)

  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = query ? `Search: ${query} | Movie App` : 'Search | Movie App'
  }, [query])

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setMovies([])
      setTotalPages(0)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    tmdbFetch('/search/movie', { query: trimmedQuery, page: currentPage })
      .then((data) => {
        if (cancelled) return
        setMovies(data.results || [])
        setTotalPages(Math.min(data.total_pages || 0, 500))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, currentPage])

  function handlePageChange(newPage) {
    setSearchParams({ query: query.trim(), page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const trimmedQuery = query.trim()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold mb-8">
          {trimmedQuery ? `Results for "${trimmedQuery}"` : 'Search'}
        </h1>

        {!trimmedQuery ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Search for a movie...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            <p>Failed to load search results: {error}</p>
          </div>
        ) : loading ? (
          <MovieGridSkeleton count={8} />
        ) : movies.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No movies found for "{trimmedQuery}"</p>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  )
}
