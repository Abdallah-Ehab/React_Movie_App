import { useQuery } from '@tanstack/react-query'
import { useLocale } from '@/context/LocaleContext'
import { tmdbFetch } from '@/lib/tmdb'

function buildParams({ page, sortBy, genreIds }) {
  const params = { page }

  if (sortBy && sortBy !== 'popularity.desc') {
    params.sort_by = sortBy
  }

  if (genreIds && genreIds.length > 0) {
    params.with_genres = genreIds.join(',')
  }

  if (params.sort_by || (genreIds && genreIds.length > 0)) {
    const today = new Date()
    const sixMonthsAgo = new Date(today)
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    params['release_date.gte'] = sixMonthsAgo.toISOString().split('T')[0]
    params['release_date.lte'] = today.toISOString().split('T')[0]
    params['with_release_type'] = '1|2|3'
  }

  return params
}

export function useMovies({ page = 1, sortBy, genreIds } = {}) {
  const { tmdbLanguage } = useLocale()
  const params = buildParams({ page, sortBy, genreIds })
  const needsDiscover = params.sort_by || params.with_genres
  const endpoint = needsDiscover ? '/discover/movie' : '/movie/now_playing'

  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', endpoint, params, tmdbLanguage],
    queryFn: () => tmdbFetch(endpoint, { ...params, language: tmdbLanguage }),
  })

  return {
    movies: data?.results || [],
    totalPages: Math.min(data?.total_pages || 1, 500),
    loading: isLoading,
    error: error?.message || null,
  }
}
