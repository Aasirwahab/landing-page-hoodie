'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'

export default function DashboardOrdersPage() {
  const orders = useQuery(api.orders.getByUser)

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>My Orders</h1>

      {orders === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <i className="ri-shopping-bag-line" style={{ fontSize: '48px', opacity: 0.2, display: 'block', marginBottom: '16px' }}></i>
          <p style={{ opacity: 0.4, marginBottom: '16px' }}>No orders yet</p>
          <Link href="/shop" style={{ color: '#FF6B35', textDecoration: 'underline' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/dashboard/orders/${order._id}`}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none', color: 'white', transition: 'all 0.2s',
              }}
            >
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                  Order #{order._id.slice(-8)}
                </p>
                <p style={{ fontSize: '13px', opacity: 0.5 }}>
                  {order.items.length} item(s) · {new Date(order._creationTime).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                  ${(order.total / 100).toFixed(2)}
                </p>
                <span style={{
                  fontSize: '12px', padding: '3px 10px', borderRadius: '10px',
                  background: order.status === 'delivered' ? 'rgba(74,222,128,0.15)' : 'rgba(255,107,53,0.15)',
                  color: order.status === 'delivered' ? '#4ade80' : '#FF6B35',
                  textTransform: 'capitalize',
                }}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
