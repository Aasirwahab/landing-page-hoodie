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

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (!onComplete) return
        // Exit animation
        const exitTl = gsap.timeline({ onComplete })
        exitTl
          .to(taglineRef.current, { opacity: 0, y: -20, duration: 0.3 })
          .to(brandRef.current, { scale: 1.2, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.1')
          .to(lineLeftRef.current, { scaleX: 0, transformOrigin: 'right center', duration: 0.4 }, '-=0.3')
          .to(lineRightRef.current, { scaleX: 0, transformOrigin: 'left center', duration: 0.4 }, '-=0.4')
          .to(overlayTopRef.current, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' }, '-=0.2')
          .to(overlayBottomRef.current, { yPercent: 100, duration: 0.8, ease: 'power3.inOut' }, '-=0.8')
      },
    })

    // Counter animation (DOM-only, no React re-renders)
    const counter = { val: 0 }
    gsap.to(counter, {
      val: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.val)
        if (counterRef.current) counterRef.current.textContent = String(v)
        if (progressBarRef.current) progressBarRef.current.style.width = `${v}%`
      },
    })

    // Brand reveal sequence
    tl.set([brandRef.current, taglineRef.current], { opacity: 0 })
      .set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 })

    // Lines draw in
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

    // Brand name appears letter by letter feel
    tl.to(brandRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4')

    // Tagline slides up
    tl.to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.1')

    // Hold for a beat
    tl.to({}, { duration: 0.6 })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* Split overlays for curtain exit */}
      <div
        ref={overlayTopRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#0a0a0a',
          zIndex: 2,
        }}
      />
      <div
        ref={overlayBottomRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#0a0a0a',
          zIndex: 2,
        }}
      />

      {/* Center content */}
      <div style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}>
        {/* Top line */}
        <div
          ref={lineLeftRef}
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.8))',
            margin: '0 auto 24px',
          }}
        />

        {/* Brand name */}
        <div ref={brandRef} style={{ opacity: 0 }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 400,
              letterSpacing: '12px',
              color: '#fff',
              margin: 0,
              lineHeight: 1,
            }}
          >
            POSSESSD
          </h1>
        </div>

        {/* Bottom line */}
        <div
          ref={lineRightRef}
          style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,107,53,0.8), transparent)',
            margin: '24px auto 0',
          }}
        />

        {/* Tagline */}
        <div
          ref={taglineRef}
          style={{
            opacity: 0,
            transform: 'translateY(10px)',
            marginTop: '20px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 300,
            }}
          >
            Premium Outerwear
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                width: '0%',
                height: '100%',
                background: 'rgba(255,107,53,0.6)',
              }}
            />
          </div>
          <span
            ref={counterRef}
            style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 300,
              minWidth: '24px',
            }}
          >
            0
          </span>
        </div>
      </div>

      {/* Corner accents */}
      <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 3 }}>
        <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '30px', right: '30px', zIndex: 3 }}>
        <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)', marginLeft: 'auto' }} />
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', marginLeft: 'auto' }} />
      </div>
    </div>
  )
}
