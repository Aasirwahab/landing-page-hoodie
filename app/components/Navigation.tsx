'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useCart, useCartActions } from '../context/CartContext'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const { state } = useCart()
  const { setCartOpen } = useCartActions()
  const [isCartAnimating, setIsCartAnimating] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className={`store-nav ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-mobile-header">
          <Link href="/" className="nav-mobile-brand">POSSESSD</Link>
          <div className="nav-mobile-actions">
            <button
              onClick={handleCartClick}
              className={`cart-toggle mobile-only ${isCartAnimating ? ' cart-toggle--animating' : ''}`}
              aria-label={`Shopping cart with ${state.itemCount} items`}
            >
              <i className="ri-shopping-bag-fill cart-toggle-icon" aria-hidden="true"></i>
              {state.itemCount > 0 && (
                <span className="cart-badge">{state.itemCount > 99 ? '99+' : state.itemCount}</span>
              )}
            </button>
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <i className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </button>
          </div>
        </div>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          <a
            href="#"
            className="nav-search-link desktop-only"
            onClick={(e) => {
              e.preventDefault()
              setShowSearch(!showSearch)
              setIsMobileMenuOpen(false)
              window.dispatchEvent(new CustomEvent('toggle-search'))
            }}
          >
            <i className="ri-search-line"></i> Search
          </a>
          
          <a
            href="#"
            className="nav-search-link mobile-only-link"
            onClick={(e) => {
              e.preventDefault()
              setShowSearch(!showSearch)
              setIsMobileMenuOpen(false)
              window.dispatchEvent(new CustomEvent('toggle-search'))
            }}
          >
            <i className="ri-search-line"></i> Search
          </a>

          {isSignedIn && (
            <div className="nav-user-area">
              <Link href="/dashboard" className="nav-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="ri-user-line"></i>
                {user?.firstName || 'Account'}
              </Link>
            </div>
          )}

          <button
            onClick={handleCartClick}
            className={`cart-toggle desktop-only ${isCartAnimating ? ' cart-toggle--animating' : ''}`}
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
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </>
  )
}
