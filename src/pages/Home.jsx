import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/Hero'
import GenreFilter from '@/components/filters/GenreFilter'
import SortSelect from '@/components/filters/SortSelect'
import MovieGrid from '@/components/movie/MovieGrid'
import MovieGridSkeleton from '@/components/movie/MovieGridSkeleton'
import Pagination from '@/components/Pagination'
import BackToTop from '@/components/BackToTop'
import { useMovies } from '@/hooks/useMovies'
import { useLocale } from '@/context/LocaleContext'

export default function Home() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [genreIds, setGenreIds] = useState([])
  const { t } = useLocale()

  const { movies, totalPages, loading, error } = useMovies({
    page,
    sortBy,
    genreIds,
  })

  useEffect(() => {
    document.title = `${t('home.title')} | ${t('app.name')}`
  }, [t])

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [page, loading])

  function handleGenreChange(ids) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setGenreIds(ids)
    setPage(1)
  }

  function handleSortChange(value) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setSortBy(value)
    setPage(1)
  }

  function handlePageChange(p) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setPage(p)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <section className="px-8 py-10 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold">{t('home.title')}</h2>
          <SortSelect value={sortBy} onChange={handleSortChange} />
        </div>

        <div className="mb-6">
          <GenreFilter selected={genreIds} onChange={handleGenreChange} />
        </div>

        {error && (
          <div className="text-center py-12 text-destructive">
            <p>{t('home.failed', { error })}</p>
          </div>
        )}

        {loading ? (
          <MovieGridSkeleton count={8} />
        ) : movies.length === 0 && !error ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">{t('home.empty')}</p>
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
      <BackToTop />
    </div>
  )
}
