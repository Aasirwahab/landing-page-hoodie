'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Product } from '../types'
import PageLayout from '../components/PageLayout'
import ProductCard from '../components/ProductCard'

export default function WomenPage() {
  const products = useQuery(api.products.getByCategory, { category: 'women' }) as Product[] | undefined
  const unisexProducts = useQuery(api.products.getByCategory, { category: 'unisex' }) as Product[] | undefined

  const allProducts = [
    ...(products ?? []),
    ...(unisexProducts ?? []),
  ]

  return (
    <PageLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Hero */}
        <div style={{
          marginBottom: '50px',
          padding: '60px 40px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(218,177,200,0.15) 0%, rgba(81,25,144,0.3) 50%, rgba(18,24,38,0.8) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>
            Collection
          </p>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '4px', marginBottom: '12px' }}>
            WOMEN
          </h1>
          <p style={{ opacity: 0.6, fontSize: '15px', maxWidth: '400px' }}>
            Premium urban outerwear crafted for the modern woman. Elegant, powerful, distinctive.
          </p>
        </div>

        {/* Products Grid */}
        {products === undefined ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>Loading...</div>
        ) : allProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No women&apos;s products yet</p>
            <p style={{ fontSize: '14px' }}>Check back soon for new arrivals</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
