'use client'

import PageLayout from '../components/PageLayout'

export default function CookiePolicyPage() {
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

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      icon: '🔒',
      desc: 'These cookies are strictly necessary for the website to function. They enable core functionality such as security, shopping cart management, and account authentication. Essential cookies cannot be disabled.',
      examples: 'Session ID, cart contents, authentication tokens, CSRF protection',
    },
    {
      name: 'Analytics Cookies',
      icon: '📊',
      desc: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data allows us to optimize our site performance and content.',
      examples: 'Google Analytics, page views, time on site, bounce rate',
    },
    {
      name: 'Functional Cookies',
      icon: '⚙️',
      desc: 'Functional cookies enable enhanced personalization and features. They remember your preferences such as language, region, and display settings to provide a tailored browsing experience.',
      examples: 'Language preference, currency selection, recently viewed items',
    },
    {
      name: 'Marketing Cookies',
      icon: '📢',
      desc: 'Marketing cookies track your activity across websites to deliver relevant advertisements. They help us measure the effectiveness of our advertising campaigns and limit the frequency of ads shown.',
      examples: 'Retargeting pixels, social media tracking, ad conversion tracking',
    },
  ]

  return (
    <PageLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Legal
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px', lineHeight: 1.1 }}>
          COOKIE POLICY
        </h1>
        <p style={{ opacity: 0.4, fontSize: '13px', marginBottom: '48px' }}>
          Last updated: March 1, 2026
        </p>

        <p style={bodyText}>
          POSSESSD uses cookies and similar technologies to provide you with the best possible experience
          on our website. This Cookie Policy explains what cookies are, how we use them, and how you can
          manage your cookie preferences.
        </p>

        {/* What Are Cookies */}
        <h2 style={sectionHeading}>What Are Cookies</h2>
        <div style={card}>
          <p style={bodyText}>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile)
            when you visit a website. They are widely used to make websites work more efficiently, provide
            a better user experience, and supply reporting information to site owners. Cookies can be
            &quot;persistent&quot; (remaining on your device until deleted) or &quot;session&quot; (deleted when you close your browser).
          </p>
        </div>

        {/* Types of Cookies */}
        <h2 style={sectionHeading}>Types of Cookies We Use</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cookieTypes.map((cookie) => (
            <div key={cookie.name} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>{cookie.icon}</span>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#FF6B35' }}>{cookie.name}</p>
              </div>
              <p style={bodyText}>{cookie.desc}</p>
              <p style={{ fontSize: '13px', opacity: 0.4, marginTop: '12px' }}>
                <strong>Examples:</strong> {cookie.examples}
              </p>
            </div>
          ))}
        </div>

        {/* Third-Party Cookies */}
        <h2 style={sectionHeading}>Third-Party Cookies</h2>
        <p style={bodyText}>
          In addition to our own cookies, we may use cookies set by third-party services that appear
          on our pages. These third parties include:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {[
            { name: 'Stripe', purpose: 'Secure payment processing and fraud prevention' },
            { name: 'Google Analytics', purpose: 'Website traffic analysis and user behavior insights' },
            { name: 'Vercel', purpose: 'Performance monitoring and edge delivery optimization' },
          ].map((tp) => (
            <div key={tp.name} style={card}>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>{tp.name}</p>
              <p style={{ fontSize: '13px', lineHeight: 1.6, opacity: 0.5 }}>{tp.purpose}</p>
            </div>
          ))}
        </div>

        {/* Managing Your Cookies */}
        <h2 style={sectionHeading}>Managing Your Cookies</h2>
        <p style={bodyText}>
          You have the right to decide whether to accept or reject cookies. You can manage your cookie
          preferences in the following ways:
        </p>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { title: 'Browser Settings', desc: 'Most browsers allow you to control cookies through their settings. You can set your browser to block or delete cookies, though this may impact site functionality.' },
            { title: 'Cookie Banner', desc: 'When you first visit our site, you can select which cookie categories to accept through our cookie consent banner.' },
            { title: 'Opt-Out Links', desc: 'Many third-party advertising networks offer opt-out mechanisms. Visit the Digital Advertising Alliance (DAA) or Network Advertising Initiative (NAI) websites for more options.' },
          ].map((method, i) => (
            <div key={method.title} style={card}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700' }}>0{i + 1}</span>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{method.title}</p>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.55 }}>{method.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cookie Duration */}
        <h2 style={sectionHeading}>Cookie Duration</h2>
        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35', marginBottom: '6px' }}>Session Cookies</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.55 }}>
                Temporary cookies that are deleted when you close your browser. Used for essential
                site functionality like maintaining your shopping session.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35', marginBottom: '6px' }}>Persistent Cookies</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.55 }}>
                Cookies that remain on your device for a set period (up to 2 years). Used for
                remembering preferences and providing analytics data.
              </p>
            </div>
          </div>
        </div>

        {/* Updates to Policy */}
        <h2 style={sectionHeading}>Updates to This Policy</h2>
        <p style={bodyText}>
          We may update this Cookie Policy from time to time to reflect changes in technology, legislation,
          or our data practices. Any changes will be posted on this page with an updated revision date.
          We encourage you to check this page periodically for the latest information on our cookie practices.
        </p>

        {/* Contact */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ ...sectionHeading, marginTop: 0 }}>Contact</h2>
          <p style={bodyText}>
            If you have any questions about our use of cookies, please contact us:
          </p>
          <div style={{ ...card, marginTop: '16px' }}>
            <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '6px' }}>
              <strong style={{ color: '#FF6B35' }}>Email:</strong> privacy@possessd.com
            </p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              <strong style={{ color: '#FF6B35' }}>Address:</strong> POSSESSD Inc., New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
