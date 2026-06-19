import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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
  const trimmedQuery = query.trim()

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', trimmedQuery, currentPage],
    queryFn: () => tmdbFetch('/search/movie', { query: trimmedQuery, page: currentPage }),
    enabled: !!trimmedQuery,
  })

  useEffect(() => {
    document.title = trimmedQuery ? `Search: ${trimmedQuery} | Movie App` : 'Search | Movie App'
  }, [trimmedQuery])

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)

  function handlePageChange(newPage) {
    setSearchParams({ query: trimmedQuery, page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

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
            <p>Failed to load search results: {error.message}</p>
          </div>
        ) : isLoading ? (
          <MovieGridSkeleton count={8} />
        ) : movies.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No movies found for &quot;{trimmedQuery}&quot;</p>
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
