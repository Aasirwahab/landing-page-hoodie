'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Product } from '../../types'
import ProductCard from '../../components/ProductCard'

export default function WishlistPage() {
  const user = useQuery(api.users.getUser)
  const allProducts = useQuery(api.products.list, {}) as Product[] | undefined

  const wishlistProducts = allProducts?.filter((p) =>
    user?.wishlist?.includes(p._id)
  ) ?? []

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>My Wishlist</h1>

      {user === undefined || allProducts === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : wishlistProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="ri-heart-line" style={{ fontSize: '48px', opacity: 0.2, display: 'block', marginBottom: '16px' }}></i>
          <p style={{ opacity: 0.4 }}>Your wishlist is empty</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
