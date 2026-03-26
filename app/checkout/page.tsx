'use client'

import { useState } from 'react'
import { useAction, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import PageLayout from '../components/PageLayout'
import Image from 'next/image'

export default function CheckoutPage() {
  const { state } = useCart()
  const router = useRouter()
  const createCheckout = useAction(api.stripe.createCheckoutSession)
  const settings = useQuery(api.settings.getAll)
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  if (state.items.length === 0) {
    return (
      <PageLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="ri-shopping-cart-line" style={{ fontSize: '60px', opacity: 0.3 }}></i>
          <h1 style={{ fontSize: '24px', marginTop: '20px', marginBottom: '12px' }}>Your cart is empty</h1>
          <button
            onClick={() => router.push('/shop')}
            style={{
              padding: '12px 24px', background: '#FF6B35', border: 'none',
              borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px',
            }}
          >
            Continue Shopping
          </button>
        </div>
      </PageLayout>
    )
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  const taxRate = settings ? parseFloat(settings.taxRate) / 100 : 0.08
  const shippingEnabled = settings ? settings.shippingEnabled === 'true' : false
  const shippingFlatRate = settings ? parseInt(settings.shippingFlatRate) : 0
  const freeShippingThreshold = settings ? parseInt(settings.freeShippingThreshold) : 0

  const subtotal = state.total
  const tax = Math.round(subtotal * taxRate)
  const shipping = !shippingEnabled
    ? 0
    : freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
      ? 0
      : shippingFlatRate
  const total = subtotal + tax + shipping

  const handleCheckout = async () => {
    if (!address.line1 || !address.city || !address.state || !address.zip) {
      alert('Please fill in your shipping address')
      return
    }

    setIsLoading(true)
    try {
      const url = await createCheckout({
        items: state.items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
        },
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      })

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  }

  const taxPercent = settings ? parseFloat(settings.taxRate) : 8

  return (
    <PageLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', letterSpacing: '2px' }}>
          CHECKOUT
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          {/* Shipping Address */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Shipping Address</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                placeholder="Address Line 1 *"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Address Line 2 (optional)"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="State *"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <input
                  placeholder="ZIP Code *"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  style={inputStyle}
                />
                <input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {state.items.map((item) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '8px',
                    background: item.background, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Image
                      src={item.imageUrl || '/images/1.png'}
                      alt={item.title}
                      width={35}
                      height={35}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', opacity: 0.6 }}>{item.color} × {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.7 }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.7 }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#4ade80' : 'inherit' }}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {taxPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.7 }}>
                  <span>Tax ({taxPercent}%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span>Total</span>
                <span style={{ color: '#FF6B35' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              style={{
                width: '100%', marginTop: '20px', padding: '16px',
                background: isLoading ? 'rgba(255,107,53,0.5)' : 'linear-gradient(135deg, #FF6B35, #e55a2b)',
                border: 'none', borderRadius: '12px', color: 'white',
                fontSize: '16px', fontWeight: '700', cursor: isLoading ? 'wait' : 'pointer',
              }}
            >
              {isLoading ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>

            <p style={{ fontSize: '11px', opacity: 0.4, textAlign: 'center', marginTop: '12px' }}>
              <i className="ri-lock-line"></i> Secured by Stripe
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
