import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useWishlist } from '@/context/WishlistContext'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const navigate = useNavigate()
  const { wishlist } = useWishlist()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="flex items-center justify-between h-[55px] px-8 bg-[#FFE353]">
      <span className="font-bold text-base text-[#292D32]">Movie App</span>

      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/wishlist')}
        >
          <FontAwesomeIcon icon={faHeart} className="text-[#292D32] text-lg" />
          <span className="text-sm text-[#292D32]">watchlist</span>
          {wishlist.length > 0 && (
            <span className="bg-[#292D32] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <span className="font-bold text-sm text-[#292D32]">En</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="cursor-pointer text-[#292D32]"
        >
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} className="text-lg" />
        </Button>
      </div>
    </nav>
  )
}
