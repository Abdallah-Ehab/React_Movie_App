import { useNavigate, useLocation } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '@/hooks/useDebounce'
import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tmdbFetch, imageUrl } from '@/lib/tmdb'
import { useLocale } from '@/context/LocaleContext'

export default function Hero() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedQuery = useDebounce(query, 500)
  const { t, tmdbLanguage, isRtl } = useLocale()
  const dropdownRef = useRef(null)

  const isHomePage = location.pathname === '/'

  const { data: suggestionsData, isFetching } = useQuery({
    queryKey: ['searchSuggestions', debouncedQuery.trim(), tmdbLanguage],
    queryFn: () => tmdbFetch('/search/movie', {
      query: debouncedQuery.trim(),
      page: 1,
      language: tmdbLanguage,
    }),
    enabled: debouncedQuery.trim().length > 0 && isHomePage,
    staleTime: 60_000,
  })

  const suggestions = suggestionsData?.results?.slice(0, 5) || []

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    setShowSuggestions(false)
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleSuggestionClick(movieId) {
    setShowSuggestions(false)
    setQuery('')
    navigate(`/movie/${movieId}`)
  }

  function handleViewAllResults() {
    setShowSuggestions(false)
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  const showDropdown = showSuggestions && debouncedQuery.trim() && isHomePage

  return (
    <div className="relative h-[350px] flex items-center justify-center">
      <img
        src="/hero_bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative text-center text-white px-8 max-w-2xl">
        <h1 className="text-4xl font-semibold mb-3">{t('hero.title')}</h1>
        <p className="text-sm mb-6 leading-relaxed text-white/80">
          {t('hero.subtitle')}
        </p>
        <form onSubmit={handleSearch} className="flex justify-center">
          <div className="relative flex w-full max-w-[600px]">
            <Input
              type="text"
              placeholder={t('hero.placeholder')}
              value={query}
              dir={isRtl ? 'rtl' : 'ltr'}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => {
                if (query.trim()) setShowSuggestions(true)
              }}
              className="h-[46px] rounded-s-[10px] rounded-e-none border-0 bg-white text-black placeholder:text-[#ADADAD] shadow-sm dark:bg-white dark:text-black dark:placeholder:text-[#ADADAD]"
            />
            <Button
              type="submit"
              className="h-[46px] w-[120px] rounded-e-[10px] rounded-s-none bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A] cursor-pointer"
            >
              <FontAwesomeIcon icon={faSearch} className="me-1" />
              {t('hero.search')}
            </Button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full start-0 end-0 z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden"
              >
                {isFetching ? (
                  <div className="flex items-center justify-center gap-2 px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>{t('common.loading')}</span>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    {suggestions.map((movie) => (
                      <button
                        key={movie.id}
                        type="button"
                        onClick={() => handleSuggestionClick(movie.id)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <img
                          src={imageUrl(movie.poster_path, 'w92')}
                          alt={movie.title}
                          className="w-8 h-12 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {movie.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {movie.release_date?.slice(0, 4) || ''}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleViewAllResults}
                      className="w-full px-3 py-2 text-sm text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700 cursor-pointer"
                    >
                      {t('hero.viewAll')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleViewAllResults}
                    className="w-full px-3 py-3 text-sm text-center text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {t('hero.viewAll')}
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
