'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useCart, useCartActions } from '../context/CartContext'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const { state } = useCart()
  const { setCartOpen } = useCartActions()
  const [isCartAnimating, setIsCartAnimating] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const navItems = [
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
    { href: '/shop', label: 'Shop All' },
    { href: '/customize', label: 'Customise' },
  ]

  const handleCartClick = () => {
    if (isCartAnimating) return
    setIsCartAnimating(true)
    setCartOpen(true)
    setTimeout(() => setIsCartAnimating(false), 300)
  }

  return (
    <nav>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
        >
          {item.label}
        </Link>
      ))}

      <a
        href="#"
        className="nav-search-link"
        onClick={(e) => {
          e.preventDefault()
          setShowSearch(!showSearch)
          window.dispatchEvent(new CustomEvent('toggle-search'))
        }}
      >
        <i className="ri-search-line"></i> Search
      </a>

      {isSignedIn && (
        <div className="nav-user-area">
          <Link href="/dashboard" className="nav-user-link">
            <i className="ri-user-line"></i>
            {user?.firstName || 'Account'}
          </Link>
        </div>
      )}

      <button
        onClick={handleCartClick}
        className={`cart-toggle${isCartAnimating ? ' cart-toggle--animating' : ''}`}
        disabled={isCartAnimating}
        aria-label={`Shopping cart with ${state.itemCount} items`}
      >
        <i className="ri-shopping-bag-fill cart-toggle-icon"></i>
        {state.itemCount > 0 && (
          <span className="cart-badge">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </span>
        )}
      </button>
    </nav>
  )
}
