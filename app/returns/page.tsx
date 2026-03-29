'use client'

import PageLayout from '../components/PageLayout'

export default function ReturnsPage() {
  const sectionHeading: React.CSSProperties = {
    fontSize: '22px', fontWeight: '600', marginTop: '48px', marginBottom: '16px', letterSpacing: '1px',
  }

  const bodyText: React.CSSProperties = {
    fontSize: '15px', lineHeight: 1.8, opacity: 0.65,
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '28px', marginBottom: '16px',
  }

  const steps = [
    {
      num: '01',
      title: 'Initiate Your Return',
      desc: 'Log into your POSSESSD account and navigate to your order history. Select the item you wish to return and click "Request Return." Alternatively, email returns@possessd.com with your order number.',
    },
    {
      num: '02',
      title: 'Receive Your Label',
      desc: 'Once your return is approved, we will email you a prepaid return shipping label within 24 hours. Print the label and attach it securely to the outside of your package.',
    },
    {
      num: '03',
      title: 'Pack & Ship',
      desc: 'Place the item in its original packaging (if available) or a sturdy box. Include all original tags and accessories. Drop the package at any authorized shipping location.',
    },
    {
      num: '04',
      title: 'Receive Your Refund',
      desc: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days. You will receive an email confirmation when the refund has been issued to your original payment method.',
    },
  ]

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Customer Care
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          RETURNS &amp; EXCHANGES
        </h1>
        <p style={{ opacity: 0.5, fontSize: '15px', marginBottom: '48px', lineHeight: 1.7 }}>
          We stand behind the quality of every POSSESSD piece. If your order does not meet your expectations,
          we are here to make it right.
        </p>

        {/* Return Policy Overview */}
        <div style={{
          ...card, textAlign: 'center' as const, padding: '40px 28px',
          background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,107,53,0.02))',
          border: '1px solid rgba(255,107,53,0.15)',
        }}>
          <p style={{ fontSize: '48px', fontWeight: '700', color: '#FF6B35', marginBottom: '8px' }}>30</p>
          <p style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Day Return Window
          </p>
          <p style={{ fontSize: '14px', opacity: 0.5, lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
            All POSSESSD purchases are eligible for return or exchange within 30 days of delivery.
            Items must be in original, unworn condition with all tags attached.
          </p>
        </div>

        {/* Eligibility */}
        <h2 style={sectionHeading}>Eligibility Conditions</h2>
        <p style={{ ...bodyText, marginBottom: '16px' }}>
          To qualify for a return or exchange, your item must meet the following conditions:
        </p>
        <div style={card}>
          {[
            'Item is within 30 days of the delivery date',
            'Item is unworn, unwashed, and in original condition',
            'All original tags, labels, and packaging are intact',
            'Item is free from perfume, deodorant, or any other odors',
            'Proof of purchase (order confirmation or receipt) is available',
          ].map((condition, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: i < 4 ? '14px' : 0 }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#FF6B35', fontSize: '11px' }}>&#10003;</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.6 }}>{condition}</p>
            </div>
          ))}
        </div>

        {/* Step by Step */}
        <h2 style={sectionHeading}>Return Process</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((step) => (
            <div key={step.num} style={card}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#FF6B35' }}>{step.num}</span>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{step.title}</p>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.55 }}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Process */}
        <h2 style={sectionHeading}>Exchange Process</h2>
        <p style={bodyText}>
          Need a different size or color? We offer free exchanges on all full-price items. Simply initiate
          a return and indicate your preferred replacement in the return request. If the desired item is in
          stock, we will ship it as soon as we receive your original item. If the replacement is a different
          price, we will adjust the charge accordingly.
        </p>

        {/* Refund Timeline */}
        <h2 style={sectionHeading}>Refund Timeline</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { stage: 'Return Received', time: '1-2 days', desc: 'Item inspection and quality check' },
            { stage: 'Refund Processed', time: '3-5 days', desc: 'Refund issued to original payment method' },
            { stage: 'Bank Processing', time: '5-10 days', desc: 'Funds appear in your account (varies by bank)' },
          ].map((item) => (
            <div key={item.stage} style={card}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35', marginBottom: '4px' }}>{item.time}</p>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>{item.stage}</p>
              <p style={{ fontSize: '13px', opacity: 0.45, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Non-Returnable Items */}
        <h2 style={sectionHeading}>Non-Returnable Items</h2>
        <div style={card}>
          <p style={{ ...bodyText, marginBottom: '14px' }}>
            The following items are final sale and cannot be returned or exchanged:
          </p>
          {[
            'Items marked as "Final Sale" at the time of purchase',
            'Gift cards and store credit',
            'Customized or personalized items',
            'Items that show signs of wear, washing, or alteration',
            'Items returned without original tags',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 4 ? '8px' : 0 }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px', marginTop: '7px', flexShrink: 0 }}>&#9670;</span>
              <p style={{ fontSize: '14px', opacity: 0.55, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Damaged/Defective */}
        <h2 style={sectionHeading}>Damaged or Defective Items</h2>
        <p style={bodyText}>
          If you receive a damaged or defective item, please contact us within 48 hours of delivery.
          Include your order number and photographs of the damage. We will arrange a free return and
          send a replacement or issue a full refund, including any shipping costs. Your satisfaction
          is our highest priority.
        </p>

        {/* Contact CTA */}
        <div style={{
          marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center' as const,
        }}>
          <p style={{ fontSize: '14px', opacity: 0.4, marginBottom: '16px' }}>Need help with a return?</p>
          <a href="/contact" style={{
            display: 'inline-block', padding: '16px 40px', background: '#FF6B35',
            borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '700',
            textDecoration: 'none', letterSpacing: '1px',
          }}>
            CONTACT SUPPORT
          </a>
          <p style={{ fontSize: '13px', opacity: 0.35, marginTop: '12px' }}>
            returns@possessd.com
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
