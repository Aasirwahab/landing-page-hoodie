'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Eagerly loaded (above fold)
import Navigation from './components/Navigation'
import BrandLoader from './components/BrandLoader'
import CustomCursor from './components/CustomCursor'

// Below-fold components (kept as regular imports since they use data-section/data-anim
// attributes that must exist when ScrollTrigger initializes)
import AnatomySection from './components/AnatomySection'
import FabricSection from './components/FabricSection'
import MagneticWrapper from './components/MagneticWrapper'

// Lazy-loaded: CampaignSection has its own internal ScrollTrigger so it's safe to defer
const CampaignSection = dynamic(() => import('./components/CampaignSection'), { ssr: false })
import { useCartActions } from './context/CartContext'
import { fallbackProducts } from './data/products'
import { Product } from './types'

// Blur placeholders for perceived loading performance
const blurPlaceholders: Record<string, string> = {
  '/images/1.webp': 'data:image/webp;base64,UklGRqYAAABXRUJQVlA4WAoAAAAQAAAABgAACQAAQUxQSEcAAAAABTVeXCwDAAtNjIpICQARZrrOgS0IG3DF6LJdHyuA1f7kkDxBlur/9J9LW6n2/+eSPl+r9/7OeSVFkt/yq1YNHXHF5pVAAwBWUDggOAAAALABAJ0BKgcACgAFQHwlsAJ0AQ5hMEgA/qwHtbP6D0WermaX6ZMh8LOvcFwh643jCWxpVVx2AAAA',
  '/images/2.webp': 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4WAoAAAAQAAAABgAACQAAQUxQSEMAAAANcBjbtlmd2HaaSe0pxrY+bhsREQgyo8s3LtL85mjMWNOXo7Bs8B8MAujHMrQcB/GauWwl2JR7tuqjJMBv/XMmQCAAAFZQOCAqAAAA8AEAnQEqBwAKAAVAfCWIAnQBH/8fB/IAAP7s15Aj6s5UB8avrV90JsAA',
  '/images/3.webp': 'data:image/webp;base64,UklGRowAAABXRUJQVlA4WAoAAAAQAAAABgAACQAAQUxQSD4AAAANYBvbtqn9bUSMfv9VmZGNOiIiSFKhzuCLPLkbEaP4bztUObrfDl94R8Bg3YGPTxLgPHxLH5kHnBC2YbcCEVZQOCAoAAAA0AEAnQEqBwAKAAVAfCWIAsOxDvtBFoAA/ui5T0rPpw2Czdq9NiAAAA==',
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const manifestoRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const heroImgRef = useRef<HTMLDivElement>(null)
  const [activeProduct, setActiveProduct] = useState(0)
  const { addItem, toggleCart } = useCartActions()

  const convexProducts = useQuery(api.products.getFeatured)
  const products: Product[] =
    convexProducts && convexProducts.length > 0
      ? (convexProducts as Product[])
      : (fallbackProducts as unknown as Product[])

  const isLoading = convexProducts === undefined

  useEffect(() => {
    setMounted(true)
  }, [])

  // ScrollTrigger-powered scroll animations (synced with Lenis smooth scroll)
  useEffect(() => {
    if (loading || !mounted) return

    const scrollTriggers: ScrollTrigger[] = []

    const sections = containerRef.current?.querySelectorAll('[data-section]')
    sections?.forEach((section) => {
      const animElements = section.querySelectorAll('[data-anim]')
      animElements.forEach((el, i) => {
        const htmlEl = el as HTMLElement
        const animType = htmlEl.dataset.anim
        const delay = parseFloat(htmlEl.dataset.animDelay || '0') + i * 0.08

        const animProps: Record<string, any> = {
          'fade-up': { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0, duration: 1, ease: 'power3.out' } },
          'fade-in': { from: { opacity: 0 }, to: { opacity: 1, duration: 1.2, ease: 'power2.out' } },
          'slide-left': { from: { opacity: 0, x: -80 }, to: { opacity: 1, x: 0, duration: 1, ease: 'power3.out' } },
          'slide-right': { from: { opacity: 0, x: 80 }, to: { opacity: 1, x: 0, duration: 1, ease: 'power3.out' } },
          'scale-in': { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' } },
          'clip-reveal': { from: { clipPath: 'inset(100% 0 0 0)' }, to: { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut' } },
          'line-draw': { from: { scaleX: 0 }, to: { scaleX: 1, duration: 1, ease: 'power3.inOut' } },
        }

        const anim = animProps[animType || '']
        if (!anim) return

        const tween = gsap.fromTo(htmlEl, anim.from, {
          ...anim.to,
          delay,
          scrollTrigger: {
            trigger: htmlEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
        if (tween.scrollTrigger) scrollTriggers.push(tween.scrollTrigger)
      })
    })

    // Refresh after next frame when layout has settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })

    return () => {
      scrollTriggers.forEach((st) => st?.kill())
    }
  }, [loading, mounted])

  // Hero entrance animation
  useEffect(() => {
    if (loading || !mounted) return

    const tl = gsap.timeline({ delay: 0.2 })

    tl.fromTo('.hero-overline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.hero-title-word', { opacity: 0, y: 80, rotateX: 40 }, { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-cta-group', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-product-image', { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.8')
      .fromTo('.hero-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.6')
      .fromTo('.hero-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')
  }, [loading, mounted])

  // Parallax on hero image (using GSAP ScrollTrigger — synced with Lenis)
  useEffect(() => {
    if (loading || !mounted) return
    if (window.innerWidth <= 1024) return

    if (!heroImgRef.current) return

    const st = gsap.to(heroImgRef.current, {
      y: 150,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: heroImgRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    }).scrollTrigger

    return () => { st?.kill() }
  }, [loading, mounted])

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product)
    },
    [addItem]
  )

  const handleBuyNow = useCallback(
    (product: Product) => {
      addItem(product)
      toggleCart()
    },
    [addItem, toggleCart]
  )

  const currentProduct = products[activeProduct] || products[0]

  if (!mounted || isLoading || loading) {
    return (
      <>
        {(!mounted || isLoading) ? (
          <div className="full-fixed-loader" />
        ) : (
          <BrandLoader onComplete={() => setLoading(false)} />
        )}
      </>
    )
  }

  return (
    <div ref={containerRef} className="premium-home">
      <CustomCursor />
      <Navigation />

      {/* ====== HERO SECTION ====== */}
      <section ref={heroRef} className="hero-section">
        {/* Background gradient */}
        <div
          className="hero-bg"
          ref={(el) => {
            if (el) el.style.setProperty('--hero-bg', currentProduct.background)
          }}
        />

        {/* Grid overlay for luxury feel */}
        <div className="hero-grid-overlay" />

        <div className="hero-content">
          <div className="hero-text-side">
            <p className="hero-overline">Fall / Winter 2025 Collection</p>

            <h1 className="hero-title perspective-600">
              <span className="hero-title-word">Redefining</span>
              <span className="hero-title-word hero-title-accent">Premium</span>
              <span className="hero-title-word">Outerwear</span>
            </h1>

            <p className="hero-subtitle">
              Engineered for those who demand excellence. Each piece is a fusion of avant-garde design
              and technical precision — crafted to command attention.
            </p>

            <div className="hero-cta-group">
              <Link href="/shop" className="hero-btn-primary">
                Explore Collection
                <i className="ri-arrow-right-line ml-8"></i>
              </Link>
              <Link href={`/products/${currentProduct.slug}`} className="hero-btn-secondary">
                View Details
              </Link>
            </div>

            {/* Badges */}
            <div className="hero-badges">
              <div className="hero-badge">
                <span className="hero-badge-number">100%</span>
                <span className="hero-badge-label">Premium Materials</span>
              </div>
              <div className="hero-badge">
                <span className="hero-badge-number">Limited</span>
                <span className="hero-badge-label">Edition Pieces</span>
              </div>
              <div className="hero-badge">
                <span className="hero-badge-number">Free</span>
                <span className="hero-badge-label">Global Shipping</span>
              </div>
            </div>
          </div>

          <div className="hero-image-side">
            <div ref={heroImgRef} className="hero-product-image">
              <Image
                src={currentProduct.imageUrl?.replace('.png', '.webp') || '/images/1.webp'}
                alt={`${currentProduct.title} - ${currentProduct.color}`}
                width={600}
                height={800}
                priority
                quality={80}
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 600px"
                placeholder="blur"
                blurDataURL={blurPlaceholders[currentProduct.imageUrl?.replace('.png', '.webp') || '/images/1.webp'] || blurPlaceholders['/images/1.webp']}
                className="img-full-contain shadow-premium"
              />
              {/* Floating price tag */}
              <div className="hero-floating-price">
                <span className="hero-price-label">Starting at</span>
                <span className="hero-price-value">{currentProduct.priceFormatted}</span>
              </div>
            </div>

            {/* Color selector dots */}
            <div className="hero-color-selector">
              {products.slice(0, 3).map((p, i) => (
                <button
                  key={p._id}
                  onClick={() => setActiveProduct(i)}
                  className={`hero-color-dot ${activeProduct === i ? 'active' : ''}`}
                  ref={(el) => {
                    if (el) el.style.setProperty('--item-bg', p.thumbBackground === '#fff' ? p.background : p.thumbBackground || '')
                  }}
                  aria-label={p.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator">
          <span>Scroll to discover</span>
          <div className="hero-scroll-line">
            <div className="hero-scroll-line-inner" />
          </div>
        </div>
      </section>

      {/* ====== MANIFESTO SECTION ====== */}
      <section ref={manifestoRef} className="manifesto-section" data-section>
        <div className="manifesto-inner">
          <div className="manifesto-line" data-anim="line-draw" />
          <p className="manifesto-overline" data-anim="fade-up">The Philosophy</p>
          <h2 className="manifesto-heading" data-anim="fade-up" data-anim-delay="0.1">
            We don&apos;t follow trends.
            <br />
            <span className="manifesto-accent">We set them.</span>
          </h2>
          <p className="manifesto-body" data-anim="fade-up" data-anim-delay="0.2">
            POSSESSD was born from a singular vision — to create outerwear that transcends the ordinary.
            Every stitch, every seam, every material choice is a deliberate act of rebellion against mediocrity.
            Our pieces aren&apos;t just worn; they&apos;re experienced.
          </p>
          <div className="manifesto-stats" data-anim="fade-up" data-anim-delay="0.3">
            <div className="manifesto-stat">
              <span className="stat-number">250+</span>
              <span className="stat-label">Hours of Development</span>
            </div>
            <div className="manifesto-stat-divider" />
            <div className="manifesto-stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Premium Fabrics</span>
            </div>
            <div className="manifesto-stat-divider" />
            <div className="manifesto-stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Iconic Colorways</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PRODUCT GALLERY SECTION ====== */}
      <section ref={galleryRef} className="gallery-section" data-section>
        <div className="gallery-header">
          <p className="gallery-overline" data-anim="fade-up">The Collection</p>
          <h2 className="gallery-title" data-anim="fade-up" data-anim-delay="0.1">
            Choose Your Statement
          </h2>
        </div>

        <div className="gallery-grid">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="gallery-card"
              data-anim={index % 2 === 0 ? 'slide-left' : 'slide-right'}
              data-anim-delay={String(index * 0.15)}
            >
              <div
                className="gallery-card-image"
                ref={(el) => {
                  if (el) el.style.setProperty('--card-bg', product.background)
                }}
              >
                <Image
                  src={product.imageUrl?.replace('.png', '.webp') || '/images/1.webp'}
                  alt={`${product.title} - ${product.color}`}
                  width={400}
                  height={550}
                  quality={75}
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
                  placeholder="blur"
                  blurDataURL={blurPlaceholders[product.imageUrl?.replace('.png', '.webp') || '/images/1.webp'] || blurPlaceholders['/images/1.webp']}
                  className="img-full-contain shadow-gallery"
                />
                <div className="gallery-card-overlay">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="gallery-card-btn"
                  >
                    <i className="ri-add-line"></i> Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="gallery-card-btn gallery-card-btn-primary"
                  >
                    <i className="ri-shopping-cart-line"></i> Buy Now
                  </button>
                </div>
              </div>
              <div className="gallery-card-info">
                <div className="gallery-card-meta">
                  <span className="gallery-card-collection">POSSESSD</span>
                  <span className="gallery-card-stock">
                    {product.inStock ? (
                      <><i className="ri-checkbox-blank-circle-fill dot-status text-success"></i> In Stock</>
                    ) : (
                      <><i className="ri-checkbox-blank-circle-fill dot-status text-error"></i> Sold Out</>
                    )}
                  </span>
                </div>
                <h3 className="gallery-card-title">{product.color}</h3>
                <div className="gallery-card-bottom">
                  <span className="gallery-card-price">{product.priceFormatted}</span>
                  <Link href={`/products/${product.slug}`} className="gallery-card-link">
                    Details <i className="ri-arrow-right-up-line"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-cta" data-anim="fade-up">
          <Link href="/shop" className="gallery-view-all">
            View All Products
            <i className="ri-arrow-right-line ml-8"></i>
          </Link>
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section ref={featuresRef} className="features-section" data-section>
        <div className="features-header">
          <p className="features-overline" data-anim="fade-up">Craftsmanship</p>
          <h2 className="features-title" data-anim="fade-up" data-anim-delay="0.1">
            Built Different
          </h2>
        </div>

        <div className="features-grid">
          {[
            {
              icon: 'ri-shield-star-line',
              title: 'Premium Down Fill',
              desc: '800+ fill power ethically sourced goose down for superior warmth without bulk.',
            },
            {
              icon: 'ri-water-flash-line',
              title: 'Weather Shield',
              desc: 'Advanced DWR coating and sealed seams keep you dry in any conditions.',
            },
            {
              icon: 'ri-temp-cold-line',
              title: 'Thermal Core',
              desc: 'Engineered insulation zones provide targeted warmth where you need it most.',
            },
            {
              icon: 'ri-ruler-2-line',
              title: 'Precision Fit',
              desc: 'Articulated patterns and stretch panels allow unrestricted movement.',
            },
            {
              icon: 'ri-leaf-line',
              title: 'Sustainable Craft',
              desc: 'Recycled fabrics and responsible sourcing — luxury with a conscience.',
            },
            {
              icon: 'ri-infinity-line',
              title: 'Built to Last',
              desc: 'Reinforced stress points and premium hardware ensure years of wear.',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card"
              data-anim="fade-up"
              data-anim-delay={String(i * 0.08)}
            >
              <div className="feature-icon-wrap">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== ADVANCED TECHNICAL SECTION ====== */}
      <AnatomySection />

      {/* ====== CINEMATIC CAMPAIGN VIDEO ====== */}
      <CampaignSection />

      <FabricSection />

      {/* ====== EDITORIAL / BRAND STORY SECTION ====== */}
      <section className="editorial-section" data-section>
        <div className="editorial-inner">
          <div className="editorial-image" data-anim="clip-reveal">
            <Image
              src={products[1]?.imageUrl?.replace('.png', '.webp') || '/images/2.webp'}
              alt="POSSESSD Editorial"
              width={600}
              height={800}
              quality={75}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 600px"
              placeholder="blur"
              blurDataURL={blurPlaceholders['/images/2.webp']}
              className="img-full-contain shadow-premium"
            />
          </div>
          <div className="editorial-text">
            <p className="editorial-overline" data-anim="fade-up">The Making</p>
            <h2 className="editorial-heading" data-anim="fade-up" data-anim-delay="0.1">
              From Concept<br />to Icon
            </h2>
            <p className="editorial-body" data-anim="fade-up" data-anim-delay="0.2">
              Every POSSESSD piece begins with a sketch — a raw idea refined through months
              of prototyping, testing, and perfecting. Our atelier works with the world&apos;s
              finest materials, hand-selected for their performance and beauty.
            </p>
            <p className="editorial-body" data-anim="fade-up" data-anim-delay="0.3">
              The result? Outerwear that doesn&apos;t just protect you from the elements —
              it transforms how you move through the world.
            </p>
            <div data-anim="fade-up" data-anim-delay="0.4">
              <Link href="/shop" className="editorial-link">
                Discover the Process
                <i className="ri-arrow-right-line ml-8"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA / NEWSLETTER SECTION ====== */}
      <section ref={ctaRef} className="cta-section" data-section>
        <div className="cta-inner">
          <p className="cta-overline" data-anim="fade-up">Join the Movement</p>
          <h2 className="cta-heading" data-anim="fade-up" data-anim-delay="0.1">
            Be First to Know
          </h2>
          <p className="cta-body" data-anim="fade-up" data-anim-delay="0.2">
            Exclusive drops. Early access. Members-only pricing.
          </p>
          <div className="cta-actions" data-anim="fade-up" data-anim-delay="0.3">
            <Link href="/shop" className="cta-btn-primary">
              Shop Now
              <i className="ri-arrow-right-line ml-8"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== PREMIUM FOOTER ====== */}
      <footer className="premium-footer">
        {/* Back to top */}
        <button
          className="footer-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <i className="ri-arrow-up-line"></i>
        </button>

        <div className="footer-inner">
          {/* Top: Large brand statement */}
          <div className="footer-hero">
            <h2 className="footer-brand-statement">
              Engineered for those who
              <br />
              <span className="footer-brand-accent">refuse to blend in.</span>
            </h2>
            <div className="footer-hero-cta">
              <Link href="/shop" className="footer-shop-btn">
                Explore Collection
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>

          <div className="footer-divider" />

          {/* Middle: Links + Newsletter */}
          <div className="footer-main">
            <div className="footer-links">
              <div className="footer-col">
                <h4>Shop</h4>
                <Link href="/men">Men</Link>
                <Link href="/women">Women</Link>
                <Link href="/shop">All Products</Link>
                <Link href="/customize">Customize</Link>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/shop">Careers</Link>
                <Link href="/shop">Press</Link>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <Link href="/dashboard">My Orders</Link>
                <Link href="/returns">Returns &amp; Exchanges</Link>
                <Link href="/size-guide">Size Guide</Link>
                <Link href="/faq">FAQ</Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h4>Stay in the Loop</h4>
              <p className="footer-newsletter-desc">
                Exclusive drops, early access, and members-only content delivered to your inbox.
              </p>
              <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="footer-newsletter-input"
                  aria-label="Email address"
                />
                <button type="submit" className="footer-newsletter-btn">
                  <i className="ri-arrow-right-line"></i>
                </button>
              </form>
            </div>
          </div>

          <div className="footer-divider" />

          {/* Bottom bar */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <h3 className="footer-logo">POSSESSD</h3>
              <p className="footer-copyright">&copy; 2025 POSSESSD. All rights reserved.</p>
            </div>

            <div className="footer-bottom-center">
              <Link href="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
              <span className="footer-legal-dot">&middot;</span>
              <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
              <span className="footer-legal-dot">&middot;</span>
              <Link href="/cookie-policy" className="footer-legal-link">Cookie Policy</Link>
            </div>

            <div className="footer-bottom-right">
              <div className="footer-socials">
                <a href="#" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
                <a href="#" aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
                <a href="#" aria-label="TikTok"><i className="ri-tiktok-line"></i></a>
                <a href="#" aria-label="Pinterest"><i className="ri-pinterest-line"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
