'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Product } from '../types'
import PageLayout from '../components/PageLayout'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'

export default function ShopPage() {
  const allProducts = useQuery(api.products.list, {}) as Product[] | undefined
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'men' | 'women' | 'unisex'>('all')

  const products = allProducts
    ? allProducts
        .filter((p) => categoryFilter === 'all' || p.category === categoryFilter)
        .sort((a, b) => {
          if (sortBy === 'price-asc') return a.price - b.price
          if (sortBy === 'price-desc') return b.price - a.price
          return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        })
    : []

  return (
    <PageLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px' }}>
            SHOP ALL
          </h1>
          <p style={{ opacity: 0.6, fontSize: '15px' }}>Browse the complete POSSESSD collection</p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '30px', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'men', 'women', 'unisex'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                  borderColor: categoryFilter === cat ? '#FF6B35' : 'rgba(255,255,255,0.15)',
                  background: categoryFilter === cat ? '#FF6B35' : 'transparent',
                  color: 'white', fontSize: '13px', cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', fontSize: '13px', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {allProducts === undefined ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>No products found</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
