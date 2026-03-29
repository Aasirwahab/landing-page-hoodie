'use client'

import PageLayout from '../components/PageLayout'

export default function PrivacyPolicyPage() {
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

  const listItem: React.CSSProperties = {
    ...bodyText, paddingLeft: '16px', position: 'relative' as const, marginBottom: '8px',
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Legal
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          PRIVACY POLICY
        </h1>
        <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '48px' }}>
          Last updated: March 1, 2026
        </p>

        <p style={bodyText}>
          At POSSESSD, your privacy is not just a legal obligation — it is a reflection of the respect we have
          for the individuals who choose our brand. This policy outlines how we collect, use, and safeguard
          your personal information when you interact with our website and services.
        </p>

        {/* Information We Collect */}
        <h2 style={sectionHeading}>Information We Collect</h2>
        <div style={card}>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#FF6B35' }}>Personal Information</p>
          <p style={bodyText}>
            When you create an account, place an order, or contact us, we may collect your name, email address,
            phone number, shipping address, and billing address.
          </p>
        </div>
        <div style={card}>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#FF6B35' }}>Payment Data</p>
          <p style={bodyText}>
            Payment transactions are processed through Stripe. We do not store your full credit card number,
            CVV, or banking credentials on our servers. Stripe handles all payment data in compliance with
            PCI-DSS standards.
          </p>
        </div>
        <div style={card}>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#FF6B35' }}>Browsing Data</p>
          <p style={bodyText}>
            We automatically collect certain information when you visit our site, including your IP address,
            browser type, device information, pages viewed, referring URL, and interaction timestamps.
          </p>
        </div>

        {/* How We Use Your Information */}
        <h2 style={sectionHeading}>How We Use Your Information</h2>
        <p style={bodyText}>We use the information we collect to:</p>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            'Process and fulfill your orders, including shipping and returns',
            'Communicate order confirmations, shipping updates, and support responses',
            'Personalize your browsing experience and product recommendations',
            'Improve our website, products, and customer service',
            'Detect and prevent fraudulent transactions',
            'Send promotional communications (only with your explicit consent)',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#FF6B35', fontSize: '8px', marginTop: '8px', flexShrink: 0 }}>&#9670;</span>
              <p style={listItem}>{item}</p>
            </div>
          ))}
        </div>

        {/* Information Sharing */}
        <h2 style={sectionHeading}>Information Sharing</h2>
        <p style={bodyText}>
          We do not sell, rent, or trade your personal information to third parties. We may share your data with
          trusted service providers who assist in operating our business — including payment processors,
          shipping carriers, and analytics platforms — strictly under contractual obligations to protect your data.
        </p>
        <p style={{ ...bodyText, marginTop: '16px' }}>
          We may also disclose information when required by law, to enforce our policies, or to protect the
          rights, property, or safety of POSSESSD, our customers, or the public.
        </p>

        {/* Data Security */}
        <h2 style={sectionHeading}>Data Security</h2>
        <div style={card}>
          <p style={bodyText}>
            We implement industry-standard security measures including SSL/TLS encryption, secure server
            infrastructure, and regular security audits. While no method of electronic transmission is 100%
            secure, we are committed to protecting your data with the highest level of care. All sensitive
            data is encrypted both in transit and at rest.
          </p>
        </div>

        {/* Your Rights */}
        <h2 style={sectionHeading}>Your Rights</h2>
        <p style={{ ...bodyText, marginBottom: '16px' }}>
          Depending on your jurisdiction, you may have the following rights regarding your personal data:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { title: 'Access', desc: 'Request a copy of the personal data we hold about you.' },
            { title: 'Correction', desc: 'Request correction of any inaccurate or incomplete data.' },
            { title: 'Deletion', desc: 'Request deletion of your personal data from our systems.' },
            { title: 'Opt-Out', desc: 'Unsubscribe from marketing communications at any time.' },
            { title: 'Portability', desc: 'Receive your data in a structured, machine-readable format.' },
            { title: 'Restriction', desc: 'Request that we limit processing of your personal data.' },
          ].map((right) => (
            <div key={right.title} style={card}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35', marginBottom: '8px' }}>{right.title}</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.55 }}>{right.desc}</p>
            </div>
          ))}
        </div>

        {/* Cookies & Tracking */}
        <h2 style={sectionHeading}>Cookies &amp; Tracking</h2>
        <p style={bodyText}>
          We use cookies and similar tracking technologies to enhance your experience, analyze site traffic,
          and understand user behavior. Essential cookies are required for the site to function properly.
          Analytics and marketing cookies are used only with your consent. For full details, please see our{' '}
          <a href="/cookie-policy" style={{ color: '#FF6B35', textDecoration: 'none' }}>Cookie Policy</a>.
        </p>

        {/* Contact */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ ...sectionHeading, marginTop: 0 }}>Contact Information</h2>
          <p style={bodyText}>
            If you have any questions or concerns about this Privacy Policy, or wish to exercise any of your
            rights, please contact us:
          </p>
          <div style={{ ...card, marginTop: '16px' }}>
            <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '6px' }}>
              <strong style={{ color: '#FF6B35' }}>Email:</strong> privacy@possessd.com
            </p>
            <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '6px' }}>
              <strong style={{ color: '#FF6B35' }}>Address:</strong> POSSESSD Inc., New York, NY 10001
            </p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              <strong style={{ color: '#FF6B35' }}>Response Time:</strong> Within 30 business days
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
