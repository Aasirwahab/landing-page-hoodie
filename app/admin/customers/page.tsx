'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function AdminCustomersPage() {
  const users = useQuery(api.users.getAllUsers)
  const orders = useQuery(api.orders.getAll)

  const getUserOrderStats = (userId: string) => {
    if (!orders) return { count: 0, total: 0 }
    const userOrders = orders.filter((o) => o.userId === userId)
    return {
      count: userOrders.length,
      total: userOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Customers</h1>
        <span style={{ fontSize: '14px', opacity: 0.5 }}>
          {users?.length ?? 0} total
        </span>
      </div>

      {users === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : users.length === 0 ? (
        <p style={{ opacity: 0.4, textAlign: 'center', padding: '60px 0' }}>No customers yet</p>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Customer', 'Email', 'Role', 'Orders', 'Total Spent', 'Joined'].map((h) => (
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
              {users.map((user) => {
                const stats = getUserOrderStats(user._id)
                return (
                  <tr key={user._id}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: user.role === 'admin'
                            ? 'linear-gradient(135deg, #FF6B35, #e55a2b)'
                            : 'rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: '600', flexShrink: 0,
                        }}>
                          {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>
                          {user.name || 'No name'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', opacity: 0.7, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                        background: user.role === 'admin' ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.06)',
                        color: user.role === 'admin' ? '#FF6B35' : 'rgba(255,255,255,0.5)',
                        textTransform: 'capitalize',
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {stats.count}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      ${(stats.total / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', opacity: 0.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {new Date(user._creationTime).toLocaleDateString()}
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
