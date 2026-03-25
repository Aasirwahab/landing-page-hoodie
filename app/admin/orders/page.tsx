'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.getAll)

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.6)' },
    paid: { bg: 'rgba(74,222,128,0.15)', text: '#4ade80' },
    processing: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
    shipped: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
    delivered: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
    cancelled: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Orders</h1>

      {orders === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : orders.length === 0 ? (
        <p style={{ opacity: 0.4, textAlign: 'center', padding: '60px 0' }}>No orders yet</p>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                  <th key={h} style={{
                    padding: '14px 16px', textAlign: 'left', fontSize: '12px',
                    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
                    opacity: 0.4, borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const sc = statusColors[order.status] || statusColors.pending
                return (
                  <tr key={order._id}>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {order._id.slice(-8)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
                        fontWeight: '600', background: sc.bg, color: sc.text, textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', opacity: 0.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {new Date(order._creationTime).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <Link href={`/admin/orders/${order._id}`} style={{
                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                      }}>
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
