'use client'

import React, { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'

export default function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        
        const section = sectionRef.current
        if (!section) return
        
        const wrapper = section.querySelector('.campaign-video-wrapper')
        if (wrapper) {
          gsap.fromTo(
            wrapper,
            { clipPath: 'inset(15% 0 15% 0)' },
            {
              clipPath: 'inset(0% 0 0% 0)',
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                end: 'center center',
                scrub: 1.5
              }
            }
          )
        }
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="campaign-section" data-cursor-text="WATCH">
      <div 
        className="campaign-video-wrapper" 
        ref={(el) => {
          if (el) el.style.setProperty('clip-path', 'inset(15% 0 15% 0)')
        }}
      >
        <div className="campaign-bg animate-cinematic-pan">
          <Image
            src="/images/campaign_shot.webp"
            alt="POSSESSD Campaign"
            fill
            quality={75}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoKAAoABUB8JYgCdAEOO2gAAP6h55PSaehYi4WokqXk/RGAAAA="
            className="campaign-image"
          />
        </div>
        
        <div className="campaign-overlay">
           <div className="campaign-play-btn">
             <i className="ri-play-fill"></i>
           </div>
        </div>
      </div>
    </section>
  )
}
