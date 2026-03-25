'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useCartActions } from '../../context/CartContext'
import PageLayout from '../../components/PageLayout'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const verifySession = useAction(api.stripe.verifySession)
  const { clearCart } = useCartActions()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (sessionId && !verified) {
      verifySession({ sessionId })
        .then(() => {
          setVerified(true)
          clearCart()
        })
        .catch(console.error)
    }
  }, [sessionId, verified, verifySession, clearCart])

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <i className="ri-check-line" style={{ fontSize: '36px', color: 'white' }}></i>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
        Order Confirmed!
      </h1>
      <p style={{ opacity: 0.6, fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
        Thank you for your purchase. Your order has been placed and you&apos;ll receive a confirmation email shortly.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link
          href="/dashboard/orders"
          style={{
            padding: '14px 24px', background: '#FF6B35', borderRadius: '10px',
            color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
          }}
        >
          View Orders
        </Link>
        <Link
          href="/shop"
          style={{
            padding: '14px 24px', background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
            color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '100px 20px', opacity: 0.5 }}>Loading...</div>
      }>
        <SuccessContent />
      </Suspense>
    </PageLayout>
  )
}
