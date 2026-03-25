'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types'

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const searchResults = useQuery(
    api.products.search,
    query.trim().length > 0 ? { query: query.trim() } : "skip"
  ) as Product[] | undefined

  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev)
    window.addEventListener('toggle-search', handler)
    return () => window.removeEventListener('toggle-search', handler)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setQuery('')
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '120px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
    >
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute', top: '30px', right: '30px',
          background: 'none', border: 'none', color: 'white',
          fontSize: '28px', cursor: 'pointer', opacity: 0.6,
        }}
      >
        <i className="ri-close-line"></i>
      </button>

      <div style={{ width: '100%', maxWidth: '600px', padding: '0 20px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '20px 24px',
            fontSize: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            color: 'white',
            outline: 'none',
            letterSpacing: '0.5px',
          }}
        />

        {/* Results */}
        <div style={{ marginTop: '30px' }}>
          {query.trim().length > 0 && searchResults !== undefined && (
            <>
              {searchResults.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '15px' }}>
                  No products found for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        textDecoration: 'none',
                        color: 'white',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '8px',
                        background: product.background,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Image
                          src={product.imageUrl || '/images/1.png'}
                          alt={product.title}
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                          {product.title} — {product.color}
                        </h4>
                        <span style={{ fontSize: '14px', color: '#FF6B35', fontWeight: '600' }}>
                          {product.priceFormatted}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
