'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Product } from '../types'

interface ProductGalleryProps {
  product: Product
}

interface GalleryImage {
  url: string
  alt: string
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Build image list: primary image first, then additional images
  const images: GalleryImage[] = []

  if (product.imageUrl) {
    images.push({ url: product.imageUrl, alt: `${product.title} - ${product.color}` })
  }

  if (product.images) {
    const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
    for (const img of sorted) {
      const url = img.url
      if (url && url !== product.imageUrl) {
        images.push({ url, alt: img.alt || `${product.title}` })
      }
    }
  }

  // Fallback
  if (images.length === 0) {
    images.push({ url: '/images/1.webp', alt: product.title })
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div>
      {/* Main Image */}
      <div
        ref={imageRef}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: product.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          position: 'relative',
          cursor: images.length > 0 ? 'zoom-in' : 'default',
        }}
      >
        <div style={{
          transition: 'transform 0.3s ease',
          transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
        }}>
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].alt}
            width={350}
            height={500}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {product.featured && (
          <span style={{
            position: 'absolute', top: '20px', left: '20px',
            background: '#FF6B35', color: 'white', padding: '6px 14px',
            borderRadius: '20px', fontSize: '12px', fontWeight: '600',
            pointerEvents: 'none',
          }}>
            Featured
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '16px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: activeIndex === i
                  ? '2px solid #FF6B35'
                  : '2px solid rgba(255,255,255,0.1)',
                background: product.background,
                cursor: 'pointer',
                flexShrink: 0,
                opacity: activeIndex === i ? 1 : 0.6,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={60}
                height={60}
                style={{ objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
