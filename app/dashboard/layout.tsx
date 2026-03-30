'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const dashNav = [
  { href: '/dashboard', label: 'Overview', icon: 'ri-dashboard-line' },
  { href: '/dashboard/orders', label: 'Orders', icon: 'ri-file-list-3-line' },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: 'ri-heart-line' },
  { href: '/dashboard/addresses', label: 'Addresses', icon: 'ri-map-pin-line' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'ri-settings-3-line' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="dashboard-layout" style={{ background: '#0a0a1a', color: 'white' }}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <div className="dashboard-sidebar-brand">
            <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '3px' }}>POSSESSD</h2>
            <p style={{ fontSize: '11px', opacity: 0.4, marginTop: '4px' }}>My Account</p>
          </div>
        </Link>

        <nav className="dashboard-sidebar-nav">
          {dashNav.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'dash-nav-active' : ''}
                style={{
                  color: isActive ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,107,53,0.08)' : 'transparent',
                }}
              >
                <i className={item.icon} style={{ fontSize: '18px' }}></i>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="dashboard-sidebar-footer">
          <Link href="/shop" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
          }}>
            <i className="ri-shopping-bag-line"></i> Continue Shopping
          </Link>
        </div>
      </aside>

      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  )
}
