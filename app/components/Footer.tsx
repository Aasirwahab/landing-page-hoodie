'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <h3 className="footer-brand-title">
            POSSESSD
          </h3>
          <p className="footer-brand-text">
            Urban elegance meets innovation. Premium outerwear for the modern explorer.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="footer-section-title">
            Shop
          </h4>
          <div className="footer-links-column">
            <Link href="/shop" className="footer-link">All Products</Link>
            <Link href="/men" className="footer-link">Men</Link>
            <Link href="/women" className="footer-link">Women</Link>
            <Link href="/customize" className="footer-link">Customise</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="footer-section-title">
            Support
          </h4>
          <div className="footer-links-column">
            <Link href="/faq" className="footer-link">FAQ</Link>
            <Link href="/returns" className="footer-link">Returns & Exchanges</Link>
            <Link href="/size-guide" className="footer-link">Size Guide</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4 className="footer-section-title">
            Legal
          </h4>
          <div className="footer-links-column">
            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/cookie-policy" className="footer-link">Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} POSSESSD. All rights reserved.
        </p>
        <div className="footer-socials">
          <a href="#" className="footer-social-link" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
          <a href="#" className="footer-social-link" aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
          <a href="#" className="footer-social-link" aria-label="TikTok"><i className="ri-tiktok-line"></i></a>
          <a href="#" className="footer-social-link" aria-label="Pinterest"><i className="ri-pinterest-line"></i></a>
        </div>
      </div>
    </footer>
  )
}
