'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { href: '/admin/products', label: 'Products', icon: 'ri-shopping-bag-line' },
  { href: '/admin/orders', label: 'Orders', icon: 'ri-file-list-3-line' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const isAdmin = useQuery(api.users.isAdmin)
  const pathname = usePathname()

  if (isAdmin === undefined) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a1a', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        Loading...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a1a', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px',
      }}>
        <i className="ri-lock-line" style={{ fontSize: '48px', opacity: 0.3 }}></i>
        <h1 style={{ fontSize: '24px' }}>Access Denied</h1>
        <p style={{ opacity: 0.5 }}>You don&apos;t have admin permissions.</p>
        <Link href="/" style={{ color: '#FF6B35', textDecoration: 'underline' }}>Go Home</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a1a', color: 'white', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 0', flexShrink: 0,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <div style={{ padding: '0 24px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '3px' }}>POSSESSD</h2>
            <p style={{ fontSize: '11px', opacity: 0.4, marginTop: '4px' }}>Admin Panel</p>
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {adminNav.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 24px', fontSize: '14px',
                  color: isActive ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,107,53,0.08)' : 'transparent',
                  borderRight: isActive ? '3px solid #FF6B35' : '3px solid transparent',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <i className={item.icon} style={{ fontSize: '18px' }}></i>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '24px', marginTop: 'auto', position: 'absolute', bottom: '20px', left: '0' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
          }}>
            <i className="ri-arrow-left-line"></i> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
