'use client'

import { useState } from 'react'
import { SortOption } from '../hooks/useProductFilters'

interface ProductFiltersProps {
  filters: {
    priceMin: string
    priceMax: string
    colors: string[]
    sizes: string[]
    inStockOnly: boolean
    sortBy: SortOption
  }
  setFilters: (fn: (prev: any) => any) => void
  availableColors: string[]
  availableSizes: string[]
  activeFilterCount: number
  clearFilters: () => void
  toggleColor: (color: string) => void
  toggleSize: (size: string) => void
  showCategoryFilter?: boolean
  categoryFilter?: string
  onCategoryChange?: (cat: string) => void
}

export default function ProductFilters({
  filters,
  setFilters,
  availableColors,
  availableSizes,
  activeFilterCount,
  clearFilters,
  toggleColor,
  toggleSize,
  showCategoryFilter = false,
  categoryFilter = 'all',
  onCategoryChange,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const pillStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#FF6B35' : 'rgba(255,255,255,0.12)'}`,
    background: active ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#FF6B35' : 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <div style={{ marginBottom: '30px' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showCategoryFilter && onCategoryChange && (
            <div style={{ display: 'flex', gap: '6px', marginRight: '8px' }}>
              {(['all', 'men', 'women', 'unisex'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
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
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: showFilters ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${showFilters ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: showFilters ? '#FF6B35' : 'rgba(255,255,255,0.7)',
              fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <i className="ri-filter-3-line"></i>
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                background: '#FF6B35', color: 'white', borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10px', fontWeight: '700',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                background: 'none', border: 'none', color: '#FF6B35',
                fontSize: '12px', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Clear all
            </button>
          )}
        </div>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters((f: any) => ({ ...f, sortBy: e.target.value }))}
          style={{
            padding: '8px 16px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'white', fontSize: '13px', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div style={{
          marginTop: '16px',
          padding: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {/* Price Range */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '600', opacity: 0.5, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Price Range
            </h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => setFilters((f: any) => ({ ...f, priceMin: e.target.value }))}
                style={{
                  width: '80px', padding: '8px 10px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', outline: 'none',
                }}
              />
              <span style={{ opacity: 0.3 }}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => setFilters((f: any) => ({ ...f, priceMax: e.target.value }))}
                style={{
                  width: '80px', padding: '8px 10px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Colors */}
          {availableColors.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', opacity: 0.5, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Color
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    style={pillStyle(filters.colors.includes(color))}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', opacity: 0.5, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Size
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    style={pillStyle(filters.sizes.includes(size))}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Stock */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '600', opacity: 0.5, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Availability
            </h4>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((f: any) => ({ ...f, inStockOnly: e.target.checked }))}
              />
              In stock only
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
