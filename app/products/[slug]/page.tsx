'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Product } from '../../types'
import PageLayout from '../../components/PageLayout'
import ProductCard from '../../components/ProductCard'
import SizeGuide from '../../components/SizeGuide'
import ReviewSection from '../../components/ReviewSection'
import ProductGallery from '../../components/ProductGallery'
import ProductJsonLd from '../../components/ProductJsonLd'
import { useCartActions } from '../../context/CartContext'
import { useState } from 'react'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = useQuery(api.products.getBySlug, { slug }) as Product | null | undefined
  const relatedProducts = useQuery(
    api.products.getRelated,
    product ? { productId: product._id, category: product.category } : "skip"
  ) as Product[] | undefined
  const avgRating = useQuery(
    api.reviews.getAverageRating,
    product ? { productId: product._id } : "skip"
  )
  const { addItem, toggleCart } = useCartActions()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  if (product === undefined) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px', opacity: 0.5 }}>Loading...</div>
      </PageLayout>
    )
  }

  if (!product) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>Product Not Found</h1>
          <p style={{ opacity: 0.5 }}>The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </PageLayout>
    )
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem(product)
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleBuyNow = () => {
    addItem(product)
    toggleCart()
  }

  return (
    <PageLayout>
      <ProductJsonLd
        product={product}
        averageRating={avgRating?.average}
        reviewCount={avgRating?.count}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Product Hero */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          marginBottom: '80px',
        }}>
          {/* Image Gallery */}
          <ProductGallery product={product} />

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>
              POSSESSD Collection
            </p>
            <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px' }}>
              {product.title}
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '24px' }}>{product.color}</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#FF6B35', marginBottom: '24px' }}>
              {product.priceFormatted}
            </p>

            {product.description && (
              <p style={{ fontSize: '15px', lineHeight: 1.7, opacity: 0.7, marginBottom: '30px' }}>
                {product.description}
              </p>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Size</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    style={{
                      background: 'none', border: 'none', color: '#FF6B35',
                      fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
                    }}
                  >
                    Size Guide
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.size)}
                      style={{
                        width: '48px', height: '48px', borderRadius: '8px',
                        border: selectedSize === s.size ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.15)',
                        background: selectedSize === s.size ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
                        color: s.inStock ? 'white' : 'rgba(255,255,255,0.3)',
                        fontSize: '14px', fontWeight: '600', cursor: s.inStock ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', fontWeight: '600',
                color: product.inStock ? '#4ade80' : '#f87171',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: product.inStock ? '#4ade80' : '#f87171',
                }}></span>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {selectedSize && product.sizes && (() => {
                const sizeEntry = product.sizes.find((s) => s.size === selectedSize)
                if (sizeEntry?.quantity !== undefined && sizeEntry.quantity > 0 && sizeEntry.quantity < 5) {
                  return (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '12px', fontWeight: '600', color: '#fbbf24',
                      marginLeft: '12px',
                    }}>
                      <i className="ri-fire-line"></i> Only {sizeEntry.quantity} left
                    </span>
                  )
                }
                return null
              })()}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                style={{
                  flex: 1, padding: '16px 24px',
                  background: 'linear-gradient(135deg, #FF6B35, #e55a2b)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '15px', fontWeight: '700', cursor: product.inStock ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', opacity: product.inStock ? 1 : 0.5,
                }}
              >
                <i className="ri-shopping-cart-line"></i> Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                style={{
                  flex: 1, padding: '16px 24px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', opacity: product.inStock ? 1 : 0.5,
                }}
              >
                {isAdding ? (
                  <><i className="ri-check-line"></i> Added!</>
                ) : (
                  <><i className="ri-add-line"></i> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', letterSpacing: '1px' }}>
              You May Also Like
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <ReviewSection productId={product._id} />
      </div>

      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </PageLayout>
  )
}
