'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useEffect, useRef } from 'react'
import OrderTimeline from '../../../components/OrderTimeline'
import PageTransition from '../../../components/PageTransition'
import BrandLoader from '../../../components/BrandLoader'
import { usePageAnimations } from '../../../hooks/usePageAnimations'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  paid: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  processing: { bg: 'rgba(255,107,53,0.12)', color: '#FF6B35' },
  shipped: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
  delivered: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  cancelled: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
}

export default function DashboardOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as Id<'orders'>
  const order = useQuery(api.orders.getById, { id: orderId })
  const { staggerCards, countUp, slideIn, fadeInSequence } = usePageAnimations()
  const totalRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!order) return
    fadeInSequence(['.order-header', '.order-timeline-section', '.order-tracking-card', '.order-items-section', '.order-summary-section', '.order-address-section'])
    staggerCards('.order-item-card', 0.3)
    if (totalRef.current) {
      countUp(totalRef.current, order.total / 100, 1.2)
    }
  }, [order, fadeInSequence, staggerCards, countUp])

  if (order === undefined) return <BrandLoader />
  if (!order) return <p>Order not found</p>

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending

  return (
    <PageTransition>
      <div style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div className="order-header" style={{ opacity: 0, marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700' }}>
              Order #{orderId.slice(-8)}
            </h1>
            <span style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
              textTransform: 'capitalize',
              background: statusStyle.bg, color: statusStyle.color,
            }}>
              {order.status}
            </span>
          </div>
          <p style={{ opacity: 0.4, fontSize: '13px' }}>
            Placed on {new Date(order._creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Timeline */}
        <div className="order-timeline-section" style={{
          opacity: 0, padding: '20px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <OrderTimeline
            currentStatus={order.status}
            statusHistory={order.statusHistory}
            creationTime={order._creationTime}
            trackingUrl={order.trackingUrl}
            shippingCarrier={order.shippingCarrier}
            estimatedDelivery={order.estimatedDelivery}
          />
        </div>

        {/* Tracking Card */}
        {order.trackingNumber && (
          <div className="order-tracking-card" style={{
            opacity: 0, padding: '20px', borderRadius: '12px', marginBottom: '24px',
            background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.12)',
          }}>
            <div className="order-detail-tracking" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '6px' }}>Tracking Number</p>
                <p style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: '600', letterSpacing: '1px' }}>
                  {order.trackingNumber}
                </p>
                {order.shippingCarrier && (
                  <p style={{ fontSize: '12px', color: '#FF6B35', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {order.shippingCarrier}
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px' }}>
                    Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 20px', borderRadius: '8px',
                    background: '#FF6B35', color: 'white', textDecoration: 'none',
                    fontSize: '13px', fontWeight: '600', display: 'flex',
                    alignItems: 'center', gap: '6px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,53,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Track Package <i className="ri-arrow-right-up-line" style={{ fontSize: '14px' }}></i>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="order-items-section" style={{
          opacity: 0, padding: '20px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</h3>
          {order.items.map((item: { title: string; color: string; size?: string; quantity: number; price: number; imageUrl?: string }, i: number) => (
            <div key={i} className="order-item-card" style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 0', opacity: 0,
              borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              {/* Product Image */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                  />
                ) : (
                  <i className="ri-shopping-bag-line" style={{ fontSize: '20px', opacity: 0.2 }}></i>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{item.title}</p>
                <p style={{ fontSize: '12px', opacity: 0.5 }}>
                  {item.color}{item.size ? ` · Size ${item.size}` : ''} · Qty {item.quantity}
                </p>
              </div>

              {/* Price */}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary-section" style={{
          opacity: 0, padding: '20px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.6 }}>
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount && order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4ade80' }}>
                <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.6 }}>
              <span>Shipping</span>
              <span style={{ color: order.shipping === 0 ? '#4ade80' : 'inherit' }}>
                {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.6 }}>
              <span>Tax</span><span>{formatPrice(order.tax)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700',
              marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span>Total</span>
              <span ref={totalRef} style={{ color: '#FF6B35' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="order-address-section" style={{
          opacity: 0, padding: '20px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Address</h3>
          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
            {order.shippingAddress.line1}<br />
            {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
