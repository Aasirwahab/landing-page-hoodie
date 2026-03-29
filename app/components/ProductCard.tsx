'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Product } from '../types'
import { useCartActions } from '../context/CartContext'
import StarRating from './StarRating'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartActions()
  const avgRating = useQuery(api.reviews.getAverageRating, { productId: product._id })
  const [isAdding, setIsAdding] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 800)
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.4s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          height: '320px',
          background: product.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Image
            src={product.imageUrl || '/images/1.webp'}
            alt={`${product.title} - ${product.color}`}
            width={200}
            height={280}
            style={{
              objectFit: 'contain',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Quick Add button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            aria-label={isAdding ? `Added ${product.title} to cart` : `Quick add ${product.title} to cart`}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.95)',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <i className={isAdding ? 'ri-check-line' : 'ri-add-line'} style={{ fontSize: '20px' }} aria-hidden="true"></i>
          </button>

          {/* Badges */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
            {product.featured && (
              <span style={{
                background: '#FF6B35', color: 'white', padding: '4px 10px',
                borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px',
              }}>
                Featured
              </span>
            )}
            {!product.inStock && (
              <span style={{
                background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px',
                borderRadius: '20px', fontSize: '11px', fontWeight: '600',
              }}>
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                {product.title}
              </h3>
              <p style={{ fontSize: '13px', opacity: 0.6 }}>{product.color}</p>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35' }}>
              {product.priceFormatted}
            </span>
          </div>
          {avgRating && avgRating.count > 0 && (
            <div style={{ marginTop: '8px' }}>
              <StarRating rating={avgRating.average} size={13} showCount count={avgRating.count} />
            </div>
          )}
          {product.sizes && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
              {product.sizes.map((s) => (
                <span
                  key={s.size}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    background: s.inStock ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    opacity: s.inStock ? 1 : 0.4,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {s.size}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
