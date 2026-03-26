'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { useEffect } from 'react'
import PageTransition from '../../components/PageTransition'
import BrandLoader from '../../components/BrandLoader'
import { usePageAnimations } from '../../hooks/usePageAnimations'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  paid: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  processing: { bg: 'rgba(255,107,53,0.12)', color: '#FF6B35' },
  shipped: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
  delivered: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  cancelled: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
}

const STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered']

export default function DashboardOrdersPage() {
  const orders = useQuery(api.orders.getByUser)
  const { staggerCards } = usePageAnimations()

  useEffect(() => {
    if (orders && orders.length > 0) {
      staggerCards('.order-card', 0.1)
    }
  }, [orders, staggerCards])

  return (
    <PageTransition>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>My Orders</h1>

        {orders === undefined ? (
          <BrandLoader />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <i className="ri-shopping-bag-line" style={{ fontSize: '48px', opacity: 0.2, display: 'block', marginBottom: '16px' }}></i>
            <p style={{ opacity: 0.4, marginBottom: '16px' }}>No orders yet</p>
            <Link href="/shop" style={{ color: '#FF6B35', textDecoration: 'underline' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((order) => {
              const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending
              const activeStepIndex = STEPS.indexOf(order.status)
              const itemImages = order.items
                .filter((item: { imageUrl?: string }) => item.imageUrl)
                .slice(0, 3)
              const extraItems = order.items.length - 3

              return (
                <Link
                  key={order._id}
                  href={`/dashboard/orders/${order._id}`}
                  className="order-card"
                  style={{
                    display: 'block', padding: '20px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none', color: 'white',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,53,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Product Thumbnails */}
                    <div style={{ display: 'flex', marginRight: '4px' }}>
                      {itemImages.length > 0 ? (
                        itemImages.map((item: { imageUrl?: string; title: string }, i: number) => (
                          <div
                            key={i}
                            style={{
                              width: '40px', height: '40px', borderRadius: '50%',
                              background: 'rgba(255,255,255,0.08)',
                              border: '2px solid #0a0a1a',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              overflow: 'hidden', marginLeft: i > 0 ? '-10px' : '0',
                              position: 'relative', zIndex: 3 - i,
                            }}
                          >
                            <img
                              src={item.imageUrl!}
                              alt={item.title}
                              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                            />
                          </div>
                        ))
                      ) : (
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className="ri-shopping-bag-line" style={{ fontSize: '16px', opacity: 0.3 }}></i>
                        </div>
                      )}
                      {extraItems > 0 && (
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)', border: '2px solid #0a0a1a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: '-10px', fontSize: '11px', fontWeight: '600',
                          color: 'rgba(255,255,255,0.5)',
                        }}>
                          +{extraItems}
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>
                        Order #{order._id.slice(-8)}
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.4 }}>
                        {order.items[0]?.title || 'Item'}
                        {order.items.length > 1 ? ` and ${order.items.length - 1} more` : ''}
                        {' · '}
                        {new Date(order._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Price + Status */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>
                        ${(order.total / 100).toFixed(2)}
                      </p>
                      <span style={{
                        fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600',
                        background: statusStyle.bg, color: statusStyle.color, textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Dots */}
                  {order.status !== 'cancelled' && (
                    <div style={{
                      display: 'flex', gap: '4px', marginTop: '14px',
                      paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)',
                      alignItems: 'center',
                    }}>
                      {STEPS.map((step, i) => (
                        <div
                          key={step}
                          style={{
                            width: i <= activeStepIndex ? '20px' : '6px',
                            height: '4px',
                            borderRadius: '2px',
                            background: i <= activeStepIndex ? '#FF6B35' : 'rgba(255,255,255,0.08)',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                      <span style={{ fontSize: '10px', opacity: 0.3, marginLeft: '8px', textTransform: 'capitalize' }}>
                        {order.status === 'delivered' ? 'Delivered' : `${order.status}`}
                      </span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
