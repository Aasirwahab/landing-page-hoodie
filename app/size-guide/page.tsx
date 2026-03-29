'use client'

import PageLayout from '../components/PageLayout'

export default function SizeGuidePage() {
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const measurements = [
    { label: 'Chest (cm)', values: ['86-91', '91-96', '96-101', '101-107', '107-112', '112-118'] },
    { label: 'Chest (in)', values: ['34-36', '36-38', '38-40', '40-42', '42-44', '44-46'] },
    { label: 'Waist (cm)', values: ['71-76', '76-81', '81-86', '86-91', '91-97', '97-102'] },
    { label: 'Waist (in)', values: ['28-30', '30-32', '32-34', '34-36', '36-38', '38-40'] },
    { label: 'Hip (cm)', values: ['86-91', '91-96', '96-101', '101-107', '107-112', '112-118'] },
    { label: 'Hip (in)', values: ['34-36', '36-38', '38-40', '40-42', '42-44', '44-46'] },
    { label: 'Sleeve (cm)', values: ['81', '83', '85', '87', '89', '91'] },
    { label: 'Sleeve (in)', values: ['32', '32.5', '33.5', '34', '35', '36'] },
  ]

  const fits = [
    {
      name: 'Regular Fit',
      desc: 'Our standard cut. Follows the natural contours of the body with ease of movement. Ideal for layering with a light base layer.',
      tag: 'True to Size',
    },
    {
      name: 'Relaxed Fit',
      desc: 'A slightly looser silhouette through the chest and body. Designed for comfort-forward styling with room for heavier mid-layers.',
      tag: 'Consider Sizing Down',
    },
    {
      name: 'Oversized Fit',
      desc: 'Intentionally generous proportions for a contemporary streetwear aesthetic. Extended shoulders and dropped hem for a bold, architectural look.',
      tag: 'Size Down 1-2 Sizes',
    },
  ]

  const measurementTips = [
    { area: 'Chest', instruction: 'Measure around the fullest part of your chest, keeping the tape level and snug but not tight. Arms relaxed at your sides.' },
    { area: 'Waist', instruction: 'Measure around your natural waistline, the narrowest part of your torso. Keep the tape comfortably loose.' },
    { area: 'Hips', instruction: 'Stand with feet together and measure around the widest part of your hips and buttocks.' },
    { area: 'Sleeve', instruction: 'Measure from the center back of your neck, across the shoulder, and down to the wrist with arm slightly bent.' },
  ]

  const thStyle: React.CSSProperties = {
    padding: '14px 16px', textAlign: 'left' as const, fontSize: '12px',
    fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' as const,
    opacity: 0.4, borderBottom: '1px solid rgba(255,255,255,0.1)',
  }

  const tdStyle = (isEven: boolean): React.CSSProperties => ({
    padding: '14px 16px', fontSize: '14px', opacity: 0.6,
    background: isEven ? 'rgba(255,255,255,0.02)' : 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  })

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Fit Guide
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          SIZE GUIDE
        </h1>
        <p style={{ opacity: 0.5, fontSize: '15px', marginBottom: '48px', lineHeight: 1.7 }}>
          Finding the perfect fit is essential to the POSSESSD experience. Use the guide below to determine
          your ideal size across our outerwear collection.
        </p>

        {/* How to Measure */}
        <h2 style={sectionHeading}>How to Measure</h2>
        <p style={{ ...bodyText, marginBottom: '16px' }}>
          For the most accurate results, use a flexible measuring tape and wear fitted clothing or measure
          over undergarments. All measurements are body measurements, not garment measurements.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px' }}>
          {measurementTips.map((tip, i) => (
            <div key={tip.area} style={card}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#FF6B35' }}>0{i + 1}</span>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#FF6B35' }}>{tip.area}</p>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.55 }}>{tip.instruction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Size Chart */}
        <h2 style={sectionHeading}>Size Chart</h2>
        <div style={{
          ...card, padding: 0, overflow: 'hidden',
          overflowX: 'auto' as const,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '120px' }}>Measurement</th>
                {sizes.map((size) => (
                  <th key={size} style={{ ...thStyle, textAlign: 'center' as const }}>
                    <span style={{ color: '#FF6B35' }}>{size}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurements.map((row, rowIndex) => (
                <tr key={row.label}>
                  <td style={{
                    ...tdStyle(rowIndex % 2 === 0),
                    fontWeight: '600', fontSize: '13px', opacity: 0.5,
                  }}>
                    {row.label}
                  </td>
                  {row.values.map((val, colIndex) => (
                    <td key={colIndex} style={{ ...tdStyle(rowIndex % 2 === 0), textAlign: 'center' as const }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Guide */}
        <h2 style={sectionHeading}>Fit Guide</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {fits.map((fit) => (
            <div key={fit.name} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' as const, gap: '8px' }}>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>{fit.name}</p>
                <span style={{
                  fontSize: '11px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' as const,
                  padding: '4px 12px', borderRadius: '20px',
                  background: 'rgba(255,107,53,0.12)', color: '#FF6B35',
                }}>
                  {fit.tag}
                </span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.55 }}>{fit.desc}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 style={sectionHeading}>Tips for Choosing the Right Size</h2>
        <div style={card}>
          {[
            'If you are between sizes, we recommend sizing up for a more relaxed fit or sizing down for a slimmer silhouette.',
            'Consider the layers you plan to wear underneath — a heavier knit may require going up one size.',
            'Each product page includes specific fit notes and model sizing information for reference.',
            'Our outerwear is designed with articulated construction for ease of movement, even in your true size.',
            'When in doubt, our customer care team is available to provide personalized sizing recommendations.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: i < 4 ? '14px' : 0 }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#FF6B35', fontSize: '11px' }}>&#10003;</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.6, lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* Still Unsure CTA */}
        <div style={{
          marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center' as const,
        }}>
          <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Still Unsure?</p>
          <p style={{ fontSize: '14px', opacity: 0.45, marginBottom: '24px', lineHeight: 1.7 }}>
            Our team is here to help you find the perfect fit. Reach out with your measurements
            and we will provide a personalized recommendation.
          </p>
          <a href="/contact" style={{
            display: 'inline-block', padding: '16px 40px', background: '#FF6B35',
            borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '700',
            textDecoration: 'none', letterSpacing: '1px',
          }}>
            GET FIT ADVICE
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
