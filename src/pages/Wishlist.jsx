import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import MovieGrid from '@/components/movie/MovieGrid'
import { useWishlist } from '@/context/WishlistContext'
import { useLocale } from '@/context/LocaleContext'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const { t } = useLocale()

  useEffect(() => {
    document.title = t('wishlist.pageTitle')
  }, [t])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-8 py-10 max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-semibold mb-6">{t('wishlist.title')}</h1>
        {wishlist.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-lg">{t('wishlist.empty')}</p>
            <p className="text-sm mt-2">
              {t('wishlist.emptyHint')}
            </p>
          </div>
        ) : (
          <MovieGrid movies={wishlist} />
        )}
      </main>
    </div>
  )
}
