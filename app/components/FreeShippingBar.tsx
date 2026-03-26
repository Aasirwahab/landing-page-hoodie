'use client'

const formatPrice = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

export default function FreeShippingBar({
  subtotal,
  freeShippingThreshold,
  shippingFlatRate,
}: {
  subtotal: number
  freeShippingThreshold: number
  shippingFlatRate: number
}) {
  if (freeShippingThreshold <= 0) return null

  const qualified = subtotal >= freeShippingThreshold
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const remaining = freeShippingThreshold - subtotal

  return (
    <div style={{ padding: '14px 0' }}>
      {/* Progress bar track */}
      <div
        style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: qualified
              ? '#4ade80'
              : `linear-gradient(90deg, #FF6B35, #FF6B35)`,
            borderRadius: '2px',
            transition: 'width 0.6s ease, background 0.4s ease',
          }}
        />
      </div>

      {/* Status text */}
      <p
        style={{
          fontSize: '12px',
          color: qualified ? '#4ade80' : 'rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {qualified ? (
          <>
            <i className="ri-check-line" style={{ fontSize: '14px' }}></i>
            You qualify for free shipping
          </>
        ) : (
          <>
            <i className="ri-truck-line" style={{ fontSize: '14px', color: '#FF6B35' }}></i>
            Spend {formatPrice(remaining)} more for free shipping
          </>
        )}
      </p>
    </div>
  )
}
