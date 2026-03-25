'use client'

import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

const dashNav = [
  { href: '/dashboard', label: 'Overview', icon: 'ri-dashboard-line' },
  { href: '/dashboard/orders', label: 'Orders', icon: 'ri-file-list-3-line' },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: 'ri-heart-line' },
  { href: '/dashboard/addresses', label: 'Addresses', icon: 'ri-map-pin-line' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'ri-settings-3-line' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const getOrCreateUser = useMutation(api.users.getOrCreateUser)

  useEffect(() => {
    getOrCreateUser().catch(console.error)
  }, [getOrCreateUser])

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
            <p style={{ fontSize: '11px', opacity: 0.4, marginTop: '4px' }}>My Account</p>
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {dashNav.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
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

        <div style={{ padding: '24px', position: 'absolute', bottom: '20px', left: '0' }}>
          <Link href="/shop" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
          }}>
            <i className="ri-shopping-bag-line"></i> Continue Shopping
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
