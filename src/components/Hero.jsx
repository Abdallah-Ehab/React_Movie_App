import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '@/hooks/useDebounce'
import { useState, useEffect } from 'react'

export default function Hero() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(debouncedQuery.trim())}`)
    }
  }, [debouncedQuery, navigate])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative h-[350px] flex items-center justify-center overflow-hidden">
      <img
        src="/hero_bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 text-center text-white px-8 max-w-2xl">
        <h1 className="text-4xl font-semibold mb-3">Welcome to our movie app</h1>
        <p className="text-sm mb-6 leading-relaxed text-white/80">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        <form onSubmit={handleSearch} className="flex justify-center">
          <div className="flex w-full max-w-[600px]">
            <Input
              type="text"
              placeholder="Search and explore...."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-[46px] rounded-l-[10px] rounded-r-none border-0 bg-white text-black placeholder:text-[#ADADAD] shadow-sm dark:bg-white dark:text-black dark:placeholder:text-[#ADADAD]"
            />
            <Button
              type="submit"
              className="h-[46px] w-[120px] rounded-r-[10px] rounded-l-none bg-[#FFE353] text-[#292D32] hover:bg-[#E8C83A] cursor-pointer"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-1" />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
