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
            <Link href="/shop" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>All Products</Link>
            <Link href="/men" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Men</Link>
            <Link href="/women" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Women</Link>
            <Link href="/customize" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Customise</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>
            Company
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>About</Link>
            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Contact</Link>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>
            Newsletter
          </h4>
          <p style={{ fontSize: '13px', opacity: 0.6, marginBottom: '12px' }}>
            Get updates on new drops and exclusives.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
                color: 'white', fontSize: '13px', outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 16px', background: '#FF6B35', border: 'none',
                borderRadius: '6px', color: 'white', fontSize: '13px',
                cursor: 'pointer', fontWeight: '600',
              }}
            >
              Join
            </button>
          </form>
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
          © {new Date().getFullYear()} POSSESSD. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Instagram"><i className="ri-instagram-line"></i></a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }} aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
        </div>
      </div>
    </footer>
  )
}
