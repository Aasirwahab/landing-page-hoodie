'use client'

import { useCart, useCartActions } from '../context/CartContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Image from 'next/image'
import FreeShippingBar from './FreeShippingBar'

export default function CartSidebar() {
  const { state } = useCart()
  const { removeItem, updateQuantity, setCartOpen, clearCart } = useCartActions()
  const router = useRouter()
  const settings = useQuery(api.settings.getAll)

  const shippingEnabled = settings ? settings.shippingEnabled === 'true' : false
  const shippingFlatRate = settings ? parseInt(settings.shippingFlatRate) : 0
  const freeShippingThreshold = settings ? parseInt(settings.freeShippingThreshold) : 0
  const shippingCost = !shippingEnabled
    ? 0
    : freeShippingThreshold > 0 && state.total >= freeShippingThreshold
      ? 0
      : shippingFlatRate

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (state.isOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-toggle')) {
        setCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [state.isOpen, setCartOpen])

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [state.isOpen])

  const handleCheckout = () => {
    if (state.items.length === 0) return
    setCartOpen(false)
    router.push('/checkout')
  }

  const formatPrice = (priceInCents: number) =>
    `$${(priceInCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-backdrop"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-header-title">
            YOUR CART ({state.itemCount})
          </h2>
          <button
            className="cart-close-btn"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            title="Close cart"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-items-container">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <i className="ri-shopping-cart-line cart-empty-icon"></i>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-subtitle">Add some products to get started</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {state.items.map((item) => (
                <div key={item._id} className="cart-item">
                  {/* Thumbnail */}
                  <div
                    className="cart-item-thumb"
                    ref={(el) => {
                      if (el) el.style.setProperty('--item-bg', item.thumbBackground || item.background)
                    }}
                  >
                    <Image
                      src={item.imageUrl || '/images/1.webp'}
                      alt={item.title}
                      width={40}
                      height={40}
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-color">{item.color}</p>
                    <p className="cart-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="cart-qty-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      -
                    </button>
                    <span className="cart-qty-value">
                      {item.quantity}
                    </span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item._id)}
                    aria-label={`Remove ${item.title} from cart`}
                    title="Remove item"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="cart-footer">
            {/* Free Shipping Bar */}
            {shippingEnabled && freeShippingThreshold > 0 && (
              <FreeShippingBar
                subtotal={state.total}
                freeShippingThreshold={freeShippingThreshold}
                shippingFlatRate={shippingFlatRate}
              />
            )}

            {/* Summary */}
            <div className="cart-summary-row">
              <span className="cart-summary-label">Subtotal</span>
              <span className="cart-summary-value">{formatPrice(state.total)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row--shipping">
              <span className="cart-summary-label">Shipping</span>
              <span className={`cart-summary-shipping ${shippingCost === 0 ? 'text-success' : ''}`}>
                {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">{formatPrice(state.total + shippingCost)}</span>
            </div>

            {/* Buttons */}
            <div className="cart-action-buttons">
              <button
                className="cart-clear-btn"
                onClick={clearCart}
              >
                Clear
              </button>
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
              >
                <i className="ri-secure-payment-line"></i>
                Checkout
              </button>
            </div>
            <p className="cart-secure-text">
              <i className="ri-lock-line"></i> Secured by Stripe
            </p>
          </div>
        )}
      </div>
    </>
  )
}
