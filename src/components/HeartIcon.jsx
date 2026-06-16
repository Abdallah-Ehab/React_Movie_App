import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons'

export default function HeartIcon({ filled, className, ...props }) {
  return (
    <FontAwesomeIcon
      icon={filled ? fasHeart : farHeart}
      className={`${className} ${filled ? 'text-[#FFE353]' : 'text-white'}`}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
      {...props}
    />
  )
}
