'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(to bottom, #0a0a1a, #000)',
      color: 'white',
      padding: '60px 40px 30px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
      }}>
        {/* Brand */}
        <div>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '3px' }}>
            POSSESSD
          </h3>
          <p style={{ fontSize: '13px', opacity: 0.6, lineHeight: 1.6 }}>
            Urban elegance meets innovation. Premium outerwear for the modern explorer.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>
            Shop
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/shop" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>All Products</Link>
            <Link href="/men" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Men</Link>
            <Link href="/women" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Women</Link>
            <Link href="/customize" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Customise</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>
            Support
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/faq" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>FAQ</Link>
            <Link href="/returns" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Returns & Exchanges</Link>
            <Link href="/size-guide" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Size Guide</Link>
            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Contact</Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</Link>
            <Link href="/cookie-policy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <p style={{ fontSize: '12px', opacity: 0.4 }}>
          &copy; {new Date().getFullYear()} POSSESSD. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Instagram"><i className="ri-instagram-line"></i></a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="TikTok"><i className="ri-tiktok-line"></i></a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Pinterest"><i className="ri-pinterest-line"></i></a>
        </div>
      </div>
    </footer>
  )
}
