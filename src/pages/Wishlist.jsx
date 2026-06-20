import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import MovieGrid from '@/components/movie/MovieGrid'
import { useWishlist } from '@/context/WishlistContext'

export default function Wishlist() {
  const { wishlist } = useWishlist()

  useEffect(() => {
    document.title = 'My Wishlist | Movie App'
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold mb-6">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">Your wishlist is empty</p>
            <p className="text-sm mt-2">
              Browse movies and click the heart to add them here.
            </p>
          </div>
        ) : (
          <MovieGrid movies={wishlist} />
        )}
      </main>
    </div>
  )
}
