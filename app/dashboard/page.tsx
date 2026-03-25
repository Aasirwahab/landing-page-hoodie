'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useUser()
  const orders = useQuery(api.orders.getByUser)
  const dbUser = useQuery(api.users.getUser)

  const totalSpent = orders
    ? orders.filter((o) => o.status !== 'cancelled' && o.status !== 'pending')
        .reduce((sum, o) => sum + o.total, 0)
    : 0

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
        Welcome back, {user?.firstName || 'there'}
      </h1>
      <p style={{ opacity: 0.5, fontSize: '14px', marginBottom: '32px' }}>
        Here&apos;s an overview of your account.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '8px' }}>Total Orders</p>
          <p style={{ fontSize: '28px', fontWeight: '700' }}>{orders?.length ?? 0}</p>
        </div>
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '8px' }}>Total Spent</p>
          <p style={{ fontSize: '28px', fontWeight: '700' }}>
            ${(totalSpent / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '8px' }}>Wishlist</p>
          <p style={{ fontSize: '28px', fontWeight: '700' }}>{dbUser?.wishlist?.length ?? 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Orders</h2>
          <Link href="/dashboard/orders" style={{ color: '#FF6B35', fontSize: '13px', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <p style={{ opacity: 0.4, textAlign: 'center', padding: '30px 0' }}>No orders yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.slice(0, 3).map((order) => (
              <Link key={order._id} href={`/dashboard/orders/${order._id}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                textDecoration: 'none', color: 'white',
              }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '14px' }}>
                    {order.items.map((i) => `${i.title} (${i.color})`).join(', ')}
                  </p>
                  <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>
                    {new Date(order._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600' }}>${(order.total / 100).toFixed(2)}</p>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                    background: 'rgba(255,107,53,0.15)', color: '#FF6B35', textTransform: 'capitalize',
                  }}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
