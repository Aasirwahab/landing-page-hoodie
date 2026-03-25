'use client'

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

export default function DashboardOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as Id<'orders'>
  const order = useQuery(api.orders.getById, { id: orderId })

  if (order === undefined) return <p style={{ opacity: 0.4 }}>Loading...</p>
  if (!order) return <p>Order not found</p>

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Order #{orderId.slice(-8)}
      </h1>
      <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '32px' }}>
        Placed on {new Date(order._creationTime).toLocaleString()}
      </p>

      {/* Status */}
      <div style={{
        padding: '20px', borderRadius: '12px', marginBottom: '24px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '4px' }}>Status</p>
          <span style={{
            fontSize: '16px', fontWeight: '700', textTransform: 'capitalize',
            color: order.status === 'delivered' ? '#4ade80' : order.status === 'cancelled' ? '#f87171' : '#FF6B35',
          }}>
            {order.status}
          </span>
        </div>
        {order.trackingNumber && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '4px' }}>Tracking</p>
            <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{
        padding: '20px', borderRadius: '12px', marginBottom: '24px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</h3>
        {order.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '12px 0',
            borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div>
              <p style={{ fontWeight: '600' }}>{item.title} — {item.color}</p>
              {item.size && <p style={{ fontSize: '12px', opacity: 0.5 }}>Size: {item.size}</p>}
              <p style={{ fontSize: '12px', opacity: 0.5 }}>Qty: {item.quantity}</p>
            </div>
            <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', opacity: 0.6 }}>
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', opacity: 0.6 }}>
            <span>Tax</span><span>{formatPrice(order.tax)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', opacity: 0.6 }}>
            <span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginTop: '8px' }}>
            <span>Total</span><span style={{ color: '#FF6B35' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div style={{
        padding: '20px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Address</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
          {order.shippingAddress.line1}<br />
          {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
          {order.shippingAddress.country}
        </p>
      </div>
    </div>
  )
}
