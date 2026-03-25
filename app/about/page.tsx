'use client'

import PageLayout from '../components/PageLayout'

export default function AboutPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Our Story
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '32px', lineHeight: 1.1 }}>
          POSSESSD
        </h1>

        <div style={{ fontSize: '16px', lineHeight: 1.8, opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p>
            Born from the intersection of urban culture and technical innovation, POSSESSD creates
            premium outerwear that defies convention. Every piece is a statement — bold, modern,
            and engineered for the modern explorer.
          </p>
          <p>
            We believe outerwear should be more than functional. It should be expressive. Our jackets
            are crafted with cutting-edge materials and designed with an obsessive attention to detail
            that sets us apart from the ordinary.
          </p>
          <p>
            Each colorway tells a story. Each stitch is intentional. From the streets to the summit,
            POSSESSD moves with you.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
          marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { label: 'Founded', value: '2024' },
            { label: 'Materials', value: 'Premium Technical' },
            { label: 'Philosophy', value: 'Urban Elegance' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#FF6B35', marginBottom: '4px' }}>{stat.value}</p>
              <p style={{ fontSize: '13px', opacity: 0.4 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
