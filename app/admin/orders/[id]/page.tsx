'use client'

import { useParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useState } from 'react'

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as Id<'orders'>
  const order = useQuery(api.orders.getById, { id: orderId })
  const updateStatus = useMutation(api.orders.updateStatus)
  const addTracking = useMutation(api.orders.addTrackingNumber)
  const [tracking, setTracking] = useState('')

  if (order === undefined) return <p style={{ opacity: 0.4 }}>Loading...</p>
  if (!order) return <p>Order not found</p>

  const handleStatusChange = async (status: typeof statuses[number]) => {
    await updateStatus({ id: orderId, status })
  }

  const handleAddTracking = async () => {
    if (!tracking.trim()) return
    await addTracking({ id: orderId, trackingNumber: tracking.trim() })
    setTracking('')
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Order #{orderId.slice(-8)}
      </h1>
      <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '32px' }}>
        {new Date(order._creationTime).toLocaleString()}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Status */}
        <div style={{
          padding: '20px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                  border: order.status === s ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.1)',
                  background: order.status === s ? 'rgba(255,107,53,0.15)' : 'transparent',
                  color: order.status === s ? '#FF6B35' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking */}
        <div style={{
          padding: '20px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tracking</h3>
          {order.trackingNumber ? (
            <p style={{ fontSize: '14px', fontFamily: 'monospace' }}>{order.trackingNumber}</p>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Add tracking number"
                style={{
                  flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px',
                  color: 'white', fontSize: '13px', outline: 'none',
                }}
              />
              <button onClick={handleAddTracking} style={{
                padding: '8px 14px', background: '#FF6B35', border: 'none',
                borderRadius: '6px', color: 'white', fontSize: '13px', cursor: 'pointer',
              }}>
                Add
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div style={{
        padding: '20px', borderRadius: '12px', marginBottom: '24px',
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

      {/* Order Items */}
      <div style={{
        padding: '20px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Items</h3>
        {order.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.title} — {item.color}</p>
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
    </div>
  )
}
