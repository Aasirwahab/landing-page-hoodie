'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Product } from '../types'
import PageLayout from '../components/PageLayout'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { useProductFilters } from '../hooks/useProductFilters'
import { useState } from 'react'

export default function ShopPage() {
  const allProducts = useQuery(api.products.list, {}) as Product[] | undefined
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categoryFiltered = allProducts
    ? allProducts.filter((p) => categoryFilter === 'all' || p.category === categoryFilter)
    : undefined

  const {
    filters, setFilters, filteredProducts,
    availableColors, availableSizes,
    activeFilterCount, clearFilters, toggleColor, toggleSize,
  } = useProductFilters(categoryFiltered)

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
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          availableColors={availableColors}
          availableSizes={availableSizes}
          activeFilterCount={activeFilterCount}
          clearFilters={clearFilters}
          toggleColor={toggleColor}
          toggleSize={toggleSize}
          showCategoryFilter
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        {/* Products Grid */}
        {allProducts === undefined ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>No products found</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
