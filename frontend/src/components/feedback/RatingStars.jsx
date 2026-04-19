import { FaStar, FaRegStar } from 'react-icons/fa'

export default function RatingStars({ rating = 0, onRate, readonly = false, size = 'md' }) {
  const sizeClasses = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }

  const handleKeyDown = (e, star) => {
    if (readonly) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRate?.(star)
    }
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate?.(star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          disabled={readonly}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className={`
            ${sizeClasses[size]} transition-colors
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            ${star <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 rounded
            disabled:hover:scale-100
          `}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  )
}
