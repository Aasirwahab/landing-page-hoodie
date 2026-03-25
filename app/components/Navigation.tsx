'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
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
    if (!isSignedIn) return
    setIsCartAnimating(true)
    setCartOpen(true)
    setTimeout(() => setIsCartAnimating(false), 300)
  }

  const handleCartIconHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state.itemCount > 0) e.currentTarget.style.transform = 'scale(1.1)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
  }

  const handleCartIconLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.background = 'none'
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
        onClick={(e) => {
          e.preventDefault()
          setShowSearch(!showSearch)
          // Dispatch custom event for search overlay
          window.dispatchEvent(new CustomEvent('toggle-search'))
        }}
        style={{ marginLeft: 'auto' }}
      >
        <i className="ri-search-line"></i> Search
      </a>

      {isSignedIn && (
        <div style={{
          marginLeft: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: '12px',
              opacity: '0.8',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <i className="ri-user-line"></i>
            {user?.firstName || 'Account'}
          </Link>
        </div>
      )}

      {isSignedIn ? (
        <button
          onClick={handleCartClick}
          className="cart-toggle"
          disabled={isCartAnimating}
          style={{
            marginLeft: isSignedIn ? '10px' : '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: isCartAnimating ? 'wait' : 'pointer',
            position: 'relative',
            padding: '12px',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isCartAnimating ? 0.7 : 1
          }}
          onMouseEnter={handleCartIconHover}
          onMouseLeave={handleCartIconLeave}
          aria-label={`Shopping cart with ${state.itemCount} items`}
        >
          <i className="ri-shopping-bag-fill" style={{ fontSize: '20px', transition: 'transform 0.2s ease' }}></i>
          {state.itemCount > 0 && (
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              backgroundColor: '#FF6B35', color: 'white', borderRadius: '50%',
              minWidth: '20px', height: '20px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 'bold',
              border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              {state.itemCount > 99 ? '99+' : state.itemCount}
            </span>
          )}
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="cart-toggle"
            style={{
              marginLeft: '20px', background: 'none', border: 'none',
              color: 'white', cursor: 'pointer', position: 'relative',
              padding: '12px', borderRadius: '50%', transition: 'all 0.3s ease',
              outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={handleCartIconHover}
            onMouseLeave={handleCartIconLeave}
            aria-label="Sign in to access cart"
          >
            <i className="ri-shopping-bag-fill" style={{ fontSize: '20px', transition: 'transform 0.2s ease' }}></i>
            {state.itemCount > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                backgroundColor: '#FF6B35', color: 'white', borderRadius: '50%',
                minWidth: '20px', height: '20px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 'bold',
                border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {state.itemCount > 99 ? '99+' : state.itemCount}
              </span>
            )}
            <div style={{
              position: 'absolute', bottom: '-2px', right: '-2px',
              backgroundColor: '#FFA500', borderRadius: '50%',
              width: '8px', height: '8px', border: '1px solid white'
            }} />
          </button>
        </SignInButton>
      )}
    </nav>
  )
}
