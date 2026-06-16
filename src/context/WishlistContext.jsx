import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = useCallback((movie) => {
    setWishlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter((m) => m.id !== movie.id)
      }
      toast.success('Added to wishlist')
      return [...prev, movie]
    })
  }, [])

  const isInWishlist = useCallback(
    (movieId) => wishlist.some((m) => m.id === movieId),
    [wishlist],
  )

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
