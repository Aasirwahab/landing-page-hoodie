'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface BrandLoaderProps {
  onComplete?: () => void
}

export default function BrandLoader({ onComplete }: BrandLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const overlayTopRef = useRef<HTMLDivElement>(null)
  const overlayBottomRef = useRef<HTMLDivElement>(null)
  const progressContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        if (!onComplete) return
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete,
          defaults: { ease: 'power2.inOut' }
        })
        
        exitTl
          .to([taglineRef.current, brandRef.current, lineLeftRef.current, lineRightRef.current, progressContainerRef.current], {
            opacity: 0,
            y: (i) => (i === 0 ? -20 : i === 1 ? -10 : 0), // Subtle movement for tagline and brand
            duration: 0.4,
            stagger: 0.05,
          })
          .to(overlayTopRef.current, { yPercent: -100, duration: 1, ease: 'power3.inOut' }, '-=0.2')
          .to(overlayBottomRef.current, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, '-=1')
          .to(loaderRef.current, { opacity: 0, duration: 0.6, display: 'none' }, '-=0.4')
      },
    })

    // Initial state
    tl.set([brandRef.current, taglineRef.current], { opacity: 0 })
      .set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 })

    // 1. Lines draw in
    tl.to(lineLeftRef.current, {
      scaleX: 1,
      transformOrigin: 'right center',
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3,
    })
      .to(
        lineRightRef.current,
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.8'
      )

    // 2. Counter animation (Now integrated into timeline)
    tl.to(counter, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.val)
        if (counterRef.current) counterRef.current.textContent = String(v)
        if (progressBarRef.current) progressBarRef.current.style.width = `${v}%`
      },
    }, '-=0.4')

    // 3. Brand name and tagline reveal (Timed with counter)
    tl.to(brandRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=1.8')

    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=1.4')

    // 4. HOLD for a beat at 100% - This ensures the 100% state stays visible
    tl.to({}, { duration: 1.2 })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={loaderRef} className="brand-loader">
      {/* Split overlays for curtain exit */}
      <div ref={overlayTopRef} className="brand-loader-overlay-top" />
      <div ref={overlayBottomRef} className="brand-loader-overlay-bottom" />

      {/* Center content */}
      <div className="brand-loader-content">
        {/* Top line */}
        <div ref={lineLeftRef} className="brand-loader-line-top" />

        {/* Brand name */}
        <div ref={brandRef} className="brand-loader-name-wrap">
          <h1 className="brand-loader-name">POSSESSD</h1>
        </div>

        {/* Bottom line */}
        <div ref={lineRightRef} className="brand-loader-line-bottom" />

        {/* Tagline */}
        <div ref={taglineRef} className="brand-loader-tagline-wrap">
          <p className="brand-loader-tagline">Premium Outerwear</p>
        </div>

        {/* Progress bar */}
        <div ref={progressContainerRef} className="brand-loader-progress-wrap">
          <div className="brand-loader-progress-rail">
            <div ref={progressBarRef} className="brand-loader-progress-bar" />
          </div>
          <span ref={counterRef} className="brand-loader-counter">
            0
          </span>
        </div>
      </div>

      {/* Corner accents */}
      <div className="brand-loader-accent-top">
        <div className="brand-loader-accent-line-h" />
        <div className="brand-loader-accent-line-v" />
      </div>
      <div className="brand-loader-accent-bottom">
        <div className="brand-loader-accent-line-h right" />
        <div className="brand-loader-accent-line-v right" />
      </div>
    </div>
  )
}
