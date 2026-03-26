'use client'

import { useParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useState } from 'react'
import OrderTimeline from '../../../components/OrderTimeline'

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const
const carriers = [
  { value: '', label: 'Select carrier' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'usps', label: 'USPS' },
  { value: 'dhl', label: 'DHL' },
  { value: 'other', label: 'Other' },
]

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as Id<'orders'>
  const order = useQuery(api.orders.getById, { id: orderId })
  const updateStatus = useMutation(api.orders.updateStatus)
  const updateShipping = useMutation(api.orders.updateShipping)
  const [trackingNum, setTrackingNum] = useState('')
  const [carrier, setCarrier] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')

  if (order === undefined) return <p style={{ opacity: 0.4 }}>Loading...</p>
  if (!order) return <p>Order not found</p>

  const handleStatusChange = async (status: typeof statuses[number]) => {
    await updateStatus({ id: orderId, status })
  }

  const handleSaveShipping = async () => {
    if (!trackingNum.trim()) return
    await updateShipping({
      id: orderId,
      trackingNumber: trackingNum.trim(),
      shippingCarrier: carrier || 'other',
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).getTime() : undefined,
    })
    setTrackingNum('')
    setCarrier('')
    setEstimatedDelivery('')
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  const inputStyle = {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    outline: 'none',
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Order #{orderId.slice(-8)}
      </h1>
      <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '32px' }}>
        {new Date(order._creationTime).toLocaleString()}
      </p>

      {/* Order Timeline */}
      <div style={{
        padding: '20px', borderRadius: '12px', marginBottom: '24px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Order Progress
        </h3>
        <OrderTimeline
          currentStatus={order.status}
          statusHistory={order.statusHistory}
          creationTime={order._creationTime}
          trackingUrl={order.trackingUrl}
          shippingCarrier={order.shippingCarrier}
          estimatedDelivery={order.estimatedDelivery}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
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

        {/* Shipping / Tracking */}
        <div style={{
          padding: '20px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping & Tracking</h3>
          {order.trackingNumber ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontSize: '14px', fontFamily: 'monospace', flex: 1 }}>{order.trackingNumber}</p>
              </div>
              {order.shippingCarrier && (
                <p style={{ fontSize: '12px', color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {order.shippingCarrier}
                </p>
              )}
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px', color: '#FF6B35', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  <i className="ri-external-link-line"></i> Track Package
                </a>
              )}
              {order.estimatedDelivery && (
                <p style={{ fontSize: '12px', opacity: 0.5 }}>
                  Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}
              >
                {carriers.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                value={trackingNum}
                onChange={(e) => setTrackingNum(e.target.value)}
                placeholder="Tracking number"
                style={{ ...inputStyle, width: '100%' }}
              />
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
                title="Estimated delivery date"
              />
              <button
                onClick={handleSaveShipping}
                style={{
                  padding: '8px 14px', background: '#FF6B35', border: 'none',
                  borderRadius: '6px', color: 'white', fontSize: '13px', cursor: 'pointer',
                }}
              >
                Save Tracking
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div style={{
          padding: '20px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: '13px', opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Status History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.statusHistory.map((entry: { status: string; timestamp: number; note?: string }, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 0',
                  borderBottom: i < order.statusHistory!.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <span style={{
                  padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
                  fontWeight: '600', textTransform: 'capitalize',
                  background: 'rgba(255,107,53,0.1)', color: '#FF6B35',
                  minWidth: '80px', textAlign: 'center',
                }}>
                  {entry.status}
                </span>
                <span style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
                {entry.note && (
                  <span style={{ fontSize: '12px', opacity: 0.4, fontStyle: 'italic' }}>{entry.note}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
        {order.items.map((item: { title: string; color: string; size?: string; quantity: number; price: number; imageUrl?: string }, i: number) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.imageUrl && (
                <div style={{
                  width: '40px', height: '40px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                </div>
              )}
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.title} — {item.color}</p>
                {item.size && <p style={{ fontSize: '12px', opacity: 0.5 }}>Size: {item.size}</p>}
                <p style={{ fontSize: '12px', opacity: 0.5 }}>Qty: {item.quantity}</p>
              </div>
            </div>
            <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', opacity: 0.6 }}>
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount && order.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px', color: '#4ade80' }}>
              <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
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
