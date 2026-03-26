'use client'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  showCount?: boolean
  count?: number
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onChange,
  showCount = false,
  count = 0,
}: StarRatingProps) {
  const stars = []

  for (let i = 1; i <= maxStars; i++) {
    const filled = rating >= i
    const half = !filled && rating >= i - 0.5

    let iconClass = 'ri-star-line'
    if (filled) iconClass = 'ri-star-fill'
    else if (half) iconClass = 'ri-star-half-fill'

    stars.push(
      interactive ? (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            color: filled || half ? '#FFD700' : 'rgba(255,255,255,0.2)',
            fontSize: `${size}px`,
            lineHeight: 1,
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }}
        >
          <i className={iconClass}></i>
        </button>
      ) : (
        <i
          key={i}
          className={iconClass}
          style={{
            color: filled || half ? '#FFD700' : 'rgba(255,255,255,0.2)',
            fontSize: `${size}px`,
          }}
        ></i>
      )
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {stars}
      {showCount && count > 0 && (
        <span style={{ fontSize: `${size * 0.75}px`, opacity: 0.5, marginLeft: '6px' }}>
          ({count})
        </span>
      )}
    </span>
  )
}
