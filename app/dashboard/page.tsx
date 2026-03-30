'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import PageTransition from '../components/PageTransition'
import BrandLoader from '../components/BrandLoader'
import { usePageAnimations } from '../hooks/usePageAnimations'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  paid: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  processing: { bg: 'rgba(255,107,53,0.12)', color: '#FF6B35' },
  shipped: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7' },
  delivered: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  cancelled: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
}

export default function DashboardPage() {
  const { user } = useUser()
  const orders = useQuery(api.orders.getByUser)
  const dbUser = useQuery(api.users.getUser)
  const { staggerCards, countUp, slideIn } = usePageAnimations()
  const ordersRef = useRef<HTMLSpanElement>(null)
  const spentRef = useRef<HTMLSpanElement>(null)
  const wishlistRef = useRef<HTMLSpanElement>(null)

  const totalSpent = orders
    ? orders.filter((o) => o.status !== 'cancelled' && o.status !== 'pending')
        .reduce((sum, o) => sum + o.total, 0)
    : 0

  useEffect(() => {
    if (orders === undefined) return
    slideIn('.dash-header', 'up', 0)
    staggerCards('.stat-card', 0.15)
    staggerCards('.recent-order-card', 0.4)

    setTimeout(() => {
      if (ordersRef.current) countUp(ordersRef.current, orders?.length ?? 0, 0.8)
      if (spentRef.current) countUp(spentRef.current, totalSpent / 100, 1.2)
      if (wishlistRef.current) countUp(wishlistRef.current, dbUser?.wishlist?.length ?? 0, 0.6)
    }, 300)
  }, [orders, dbUser, totalSpent, staggerCards, countUp, slideIn])

  if (orders === undefined) return <BrandLoader />

  return (
    <PageTransition>
      <div>
        <div className="dash-header" style={{ opacity: 0, marginBottom: '32px' }}>
          <h1 className="dashboard-welcome-title" style={{ fontWeight: '700', marginBottom: '8px' }}>
            Welcome back, {user?.firstName || 'there'}
          </h1>
          <p style={{ opacity: 0.5, fontSize: '14px' }}>
            Here&apos;s an overview of your account.
          </p>
        </div>

        <div className="dashboard-stats-grid">
          <div className="stat-card" style={{
            padding: '24px', borderRadius: '12px', opacity: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(255,107,53,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ri-shopping-bag-line" style={{ fontSize: '18px', color: '#FF6B35' }}></i>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.5 }}>Total Orders</p>
            </div>
            <p className="dashboard-stat-value" style={{ fontWeight: '700' }}>
              <span ref={ordersRef}>0</span>
            </p>
          </div>
          <div className="stat-card" style={{
            padding: '24px', borderRadius: '12px', opacity: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(74,222,128,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ri-money-dollar-circle-line" style={{ fontSize: '18px', color: '#4ade80' }}></i>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.5 }}>Total Spent</p>
            </div>
            <p className="dashboard-stat-value" style={{ fontWeight: '700' }}>
              $<span ref={spentRef}>0.00</span>
            </p>
          </div>
          <div className="stat-card" style={{
            padding: '24px', borderRadius: '12px', opacity: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(248,113,113,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="ri-heart-line" style={{ fontSize: '18px', color: '#f87171' }}></i>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.5 }}>Wishlist</p>
            </div>
            <p className="dashboard-stat-value" style={{ fontWeight: '700' }}>
              <span ref={wishlistRef}>0</span>
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-recent-orders-box" style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Orders</h2>
            <Link href="/dashboard/orders" style={{ color: '#FF6B35', fontSize: '13px', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p style={{ opacity: 0.4, textAlign: 'center', padding: '30px 0' }}>No orders yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.slice(0, 3).map((order) => {
                const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                return (
                  <Link
                    key={order._id}
                    href={`/dashboard/orders/${order._id}`}
                    className="recent-order-card"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)',
                      textDecoration: 'none', color: 'white', opacity: 0,
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {/* Thumbnail */}
                    {order.items[0]?.imageUrl ? (
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img
                          src={order.items[0].imageUrl}
                          alt={order.items[0].title}
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className="ri-shopping-bag-line" style={{ fontSize: '18px', opacity: 0.2 }}></i>
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>
                        {order.items[0]?.title || 'Order'}
                        {order.items.length > 1 ? ` +${order.items.length - 1}` : ''}
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '2px' }}>
                        {new Date(order._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>${(order.total / 100).toFixed(2)}</p>
                      <span style={{
                        fontSize: '11px', padding: '3px 8px', borderRadius: '10px', fontWeight: '600',
                        background: statusStyle.bg, color: statusStyle.color, textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
