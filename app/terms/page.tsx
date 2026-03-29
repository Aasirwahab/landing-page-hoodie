'use client'

import PageLayout from '../components/PageLayout'

export default function TermsPage() {
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

  const numberedSection = (num: string, title: string) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '48px', marginBottom: '16px' }}>
      <span style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700', opacity: 0.6 }}>{num}</span>
      <h2 style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '1px' }}>{title}</h2>
    </div>
  )

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Legal
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          TERMS OF SERVICE
        </h1>
        <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '48px' }}>
          Effective: March 1, 2026
        </p>

        <p style={bodyText}>
          Welcome to POSSESSD. These Terms of Service govern your access to and use of our website,
          products, and services. By accessing or using possessd.com, you agree to be bound by these terms.
          Please read them carefully before proceeding.
        </p>

        {/* 01 - Agreement to Terms */}
        {numberedSection('01', 'Agreement to Terms')}
        <p style={bodyText}>
          By accessing this website, you confirm that you are at least 18 years of age and agree to comply
          with and be bound by these Terms of Service. If you do not agree with any part of these terms,
          you must not use our website or services. Your continued use of the site constitutes acceptance
          of any modifications to these terms.
        </p>

        {/* 02 - Use of the Site */}
        {numberedSection('02', 'Use of the Site')}
        <p style={bodyText}>
          You agree to use this site only for lawful purposes and in a manner that does not infringe upon
          the rights of others. You shall not:
        </p>
        <div style={{ ...card, marginTop: '16px' }}>
          {[
            'Use the site in any way that violates applicable local, national, or international law',
            'Attempt to gain unauthorized access to any part of the site or its systems',
            'Transmit any malicious code, viruses, or harmful data',
            'Engage in any activity that disrupts or interferes with the site\'s functionality',
            'Scrape, data-mine, or harvest content without express written permission',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 4 ? '10px' : 0 }}>
              <span style={{ color: '#FF6B35', fontSize: '8px', marginTop: '7px', flexShrink: 0 }}>&#9670;</span>
              <p style={{ ...bodyText, marginBottom: 0 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* 03 - Products & Pricing */}
        {numberedSection('03', 'Products & Pricing')}
        <p style={bodyText}>
          All product descriptions, imagery, and specifications are provided for informational purposes.
          We strive for accuracy but do not warrant that descriptions, pricing, or other content is
          error-free. Colors may vary slightly due to monitor settings and photographic conditions.
        </p>
        <p style={{ ...bodyText, marginTop: '16px' }}>
          Prices are listed in USD and are subject to change without notice. We reserve the right to
          modify or discontinue any product at any time. In the event of a pricing error, we reserve
          the right to cancel any orders placed at the incorrect price.
        </p>

        {/* 04 - Orders & Payment */}
        {numberedSection('04', 'Orders & Payment')}
        <p style={bodyText}>
          By placing an order, you are making an offer to purchase. All orders are subject to acceptance
          and availability. We reserve the right to refuse or cancel any order for any reason, including
          suspected fraud, unauthorized transactions, or pricing errors.
        </p>
        <p style={{ ...bodyText, marginTop: '16px' }}>
          Payment is processed securely through Stripe at the time of purchase. We accept major credit
          cards, debit cards, and other payment methods as displayed at checkout. You are responsible
          for any applicable taxes and duties.
        </p>

        {/* 05 - Shipping & Delivery */}
        {numberedSection('05', 'Shipping & Delivery')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '8px' }}>
          {[
            { title: 'Processing', desc: 'Orders are processed within 1-3 business days of confirmation.' },
            { title: 'Domestic', desc: 'Standard shipping within the US takes 5-7 business days.' },
            { title: 'International', desc: 'International orders may take 10-21 business days depending on destination.' },
            { title: 'Risk of Loss', desc: 'Risk of loss passes to you upon delivery to the shipping carrier.' },
          ].map((item) => (
            <div key={item.title} style={card}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35', marginBottom: '8px' }}>{item.title}</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.55 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 06 - Intellectual Property */}
        {numberedSection('06', 'Intellectual Property')}
        <p style={bodyText}>
          All content on this website — including but not limited to text, graphics, logos, icons, images,
          audio clips, digital downloads, and software — is the property of POSSESSD or its content
          suppliers and is protected by international copyright, trademark, and intellectual property laws.
          The POSSESSD name, logo, and all related marks are trademarks of POSSESSD Inc. Unauthorized
          reproduction, distribution, or use of any materials is strictly prohibited.
        </p>

        {/* 07 - Limitation of Liability */}
        {numberedSection('07', 'Limitation of Liability')}
        <div style={card}>
          <p style={bodyText}>
            To the fullest extent permitted by law, POSSESSD shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the site
            or products. Our total liability shall not exceed the amount you paid for the specific
            product or service giving rise to the claim. This limitation applies regardless of the
            theory of liability, whether in contract, tort, strict liability, or otherwise.
          </p>
        </div>

        {/* 08 - Governing Law */}
        {numberedSection('08', 'Governing Law')}
        <p style={bodyText}>
          These Terms of Service shall be governed by and construed in accordance with the laws of the
          State of New York, United States, without regard to its conflict of law principles. Any disputes
          arising under these terms shall be resolved exclusively in the state or federal courts located
          in New York County, New York.
        </p>

        {/* 09 - Changes to Terms */}
        {numberedSection('09', 'Changes to Terms')}
        <p style={bodyText}>
          We reserve the right to update or modify these Terms of Service at any time without prior notice.
          Changes will be effective immediately upon posting to this page with an updated effective date.
          Your continued use of the site after any changes constitutes your acceptance of the revised terms.
          We encourage you to review this page periodically.
        </p>

        {/* 10 - Contact */}
        {numberedSection('10', 'Contact')}
        <p style={bodyText}>
          For any questions regarding these Terms of Service, please reach out to us:
        </p>
        <div style={{ ...card, marginTop: '16px' }}>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '6px' }}>
            <strong style={{ color: '#FF6B35' }}>Email:</strong> legal@possessd.com
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '6px' }}>
            <strong style={{ color: '#FF6B35' }}>Address:</strong> POSSESSD Inc., New York, NY 10001
          </p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            <strong style={{ color: '#FF6B35' }}>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
