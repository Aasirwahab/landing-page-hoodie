'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

type Period = 7 | 30 | 90

const STATUS_COLORS: Record<string, string> = {
  pending: '#fbbf24',
  paid: '#4ade80',
  processing: '#3b82f6',
  shipped: '#818cf8',
  delivered: '#a78bfa',
  cancelled: '#f87171',
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>(30)
  const revenue = useQuery(api.analytics.getRevenueOverTime, { days: period })
  const topProducts = useQuery(api.analytics.getTopProducts, { limit: 5 })
  const statusBreakdown = useQuery(api.analytics.getOrderStatusBreakdown)
  const stats = useQuery(api.analytics.getSummaryStats, { days: period })

  const maxRevenue = revenue
    ? Math.max(...revenue.map((d) => d.revenue), 1)
    : 1

  const totalStatusOrders = statusBreakdown
    ? statusBreakdown.reduce((sum, s) => sum + s.count, 0)
    : 0

  const maxProductRevenue = topProducts
    ? Math.max(...topProducts.map((p) => p.totalRevenue), 1)
    : 1

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '1px' }}>Analytics</h1>
          <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '4px' }}>Store performance overview</p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {([7, 30, 90] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                background: period === p ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${period === p ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: period === p ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Revenue', value: stats ? `$${(stats.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '...', icon: 'ri-money-dollar-circle-line', color: '#4ade80' },
          { label: 'Orders', value: stats?.totalOrders ?? '...', icon: 'ri-file-list-3-line', color: '#3b82f6' },
          { label: 'Avg Order', value: stats ? `$${(stats.averageOrderValue / 100).toFixed(2)}` : '...', icon: 'ri-funds-line', color: '#FF6B35' },
          { label: 'Customers', value: stats?.totalCustomers ?? '...', icon: 'ri-user-line', color: '#a78bfa' },
        ].map((card) => (
          <div key={card.label} style={{
            padding: '20px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>{card.label}</span>
              <i className={card.icon} style={{ fontSize: '18px', color: card.color }}></i>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '700' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {/* Revenue Chart */}
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Revenue Over Time</h2>
          {revenue ? (
            <div style={{ position: 'relative', height: '200px' }}>
              <svg width="100%" height="200" viewBox={`0 0 ${revenue.length * 20} 200`} preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 50, 100, 150].map((y) => (
                  <line key={y} x1="0" y1={y} x2={revenue.length * 20} y2={y}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                ))}
                {/* Area */}
                <path
                  d={`M 0 200 ${revenue.map((d, i) => {
                    const x = i * (revenue.length > 1 ? (revenue.length * 20 - 1) / (revenue.length - 1) : 0)
                    const y = 200 - (d.revenue / maxRevenue) * 180
                    return `L ${x} ${y}`
                  }).join(' ')} L ${(revenue.length - 1) * (revenue.length > 1 ? (revenue.length * 20 - 1) / (revenue.length - 1) : 0)} 200 Z`}
                  fill="rgba(255,107,53,0.1)"
                />
                {/* Line */}
                <polyline
                  points={revenue.map((d, i) => {
                    const x = i * (revenue.length > 1 ? (revenue.length * 20 - 1) / (revenue.length - 1) : 0)
                    const y = 200 - (d.revenue / maxRevenue) * 180
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="2"
                />
                {/* Dots for non-zero values */}
                {revenue.map((d, i) => {
                  if (d.revenue === 0) return null
                  const x = i * (revenue.length > 1 ? (revenue.length * 20 - 1) / (revenue.length - 1) : 0)
                  const y = 200 - (d.revenue / maxRevenue) * 180
                  return (
                    <circle key={i} cx={x} cy={y} r="3" fill="#FF6B35" />
                  )
                })}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', opacity: 0.3 }}>{revenue[0]?.date}</span>
                <span style={{ fontSize: '11px', opacity: 0.3 }}>{revenue[revenue.length - 1]?.date}</span>
              </div>
            </div>
          ) : (
            <p style={{ opacity: 0.4 }}>Loading...</p>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div style={{
          padding: '24px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Order Status</h2>
          {statusBreakdown ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {statusBreakdown.map((item) => (
                <div key={item.status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{item.status}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.count}</span>
                  </div>
                  <div style={{
                    height: '6px', borderRadius: '3px',
                    background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      width: `${totalStatusOrders > 0 ? (item.count / totalStatusOrders) * 100 : 0}%`,
                      background: STATUS_COLORS[item.status] || '#666',
                      transition: 'width 0.5s ease',
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ opacity: 0.4 }}>Loading...</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div style={{
        padding: '24px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Top Selling Products</h2>
        {topProducts ? (
          topProducts.length === 0 ? (
            <p style={{ opacity: 0.4, textAlign: 'center', padding: '30px 0', fontSize: '14px' }}>
              No sales data yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProducts.map((product, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(255,107,53,0.15)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '700', color: '#FF6B35', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        {product.title} — {product.color}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                        ${(product.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{
                      height: '6px', borderRadius: '3px',
                      background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '3px',
                        width: `${(product.totalRevenue / maxProductRevenue) * 100}%`,
                        background: 'linear-gradient(90deg, #FF6B35, #FF8C42)',
                        transition: 'width 0.5s ease',
                      }}></div>
                    </div>
                    <span style={{ fontSize: '11px', opacity: 0.4, marginTop: '4px', display: 'inline-block' }}>
                      {product.totalQuantity} units sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <p style={{ opacity: 0.4 }}>Loading...</p>
        )}
      </div>
    </div>
  )
}
