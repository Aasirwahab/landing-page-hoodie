'use client'

import PageLayout from '../../components/PageLayout'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <PageLayout>
      <div style={{ textAlign: 'center', padding: '100px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(248,113,113,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <i className="ri-close-line" style={{ fontSize: '36px', color: '#f87171' }}></i>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
          Checkout Cancelled
        </h1>
        <p style={{ opacity: 0.6, fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
          Your payment was not processed. Your cart items are still saved.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            href="/checkout"
            style={{
              padding: '14px 24px', background: '#FF6B35', borderRadius: '10px',
              color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
            }}
          >
            Try Again
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
    </PageLayout>
  )
}
