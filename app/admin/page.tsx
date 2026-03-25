'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Link from 'next/link'

export default function AdminDashboard() {
  const products = useQuery(api.products.list, {})
  const orders = useQuery(api.orders.getAll)
  const users = useQuery(api.users.getAllUsers)

  const totalRevenue = orders
    ? orders
        .filter((o) => o.status !== 'cancelled' && o.status !== 'pending')
        .reduce((sum, o) => sum + o.total, 0)
    : 0

  const recentOrders = orders?.slice(0, 5) ?? []

  const statCards = [
    { label: 'Products', value: products?.length ?? 0, icon: 'ri-shopping-bag-line', color: '#FF6B35' },
    { label: 'Orders', value: orders?.length ?? 0, icon: 'ri-file-list-3-line', color: '#3b82f6' },
    { label: 'Revenue', value: `$${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: 'ri-money-dollar-circle-line', color: '#4ade80' },
    { label: 'Customers', value: users?.length ?? 0, icon: 'ri-user-line', color: '#a78bfa' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Dashboard</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            padding: '24px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', opacity: 0.5 }}>{card.label}</span>
              <i className={card.icon} style={{ fontSize: '20px', color: card.color }}></i>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ color: '#FF6B35', fontSize: '13px', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ opacity: 0.4, fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>No orders yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: '12px',
                    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
                    opacity: 0.4, borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Link href={`/admin/orders/${order._id}`} style={{ color: '#FF6B35', textDecoration: 'none' }}>
                      {order._id.slice(-8)}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {order.items.length} item(s)
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    ${(order.total / 100).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: order.status === 'paid' ? 'rgba(74,222,128,0.15)' :
                        order.status === 'shipped' ? 'rgba(59,130,246,0.15)' :
                          order.status === 'delivered' ? 'rgba(168,85,247,0.15)' :
                            order.status === 'cancelled' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.08)',
                      color: order.status === 'paid' ? '#4ade80' :
                        order.status === 'shipped' ? '#3b82f6' :
                          order.status === 'delivered' ? '#a855f7' :
                            order.status === 'cancelled' ? '#f87171' : 'rgba(255,255,255,0.6)',
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', opacity: 0.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {new Date(order._creationTime).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
