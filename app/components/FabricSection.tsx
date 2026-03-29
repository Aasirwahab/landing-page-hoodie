'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FabricSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const triggers: ScrollTrigger[] = []

    // Animate Panel 1 text
    const panel1Content = section.querySelector('.panel-left')
    if (panel1Content) {
      const t = gsap.fromTo(
        panel1Content,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      )
      if (t.scrollTrigger) triggers.push(t.scrollTrigger)
    }

    // Animate Panel 2 text
    const panel2Content = section.querySelector('.panel-center')
    if (panel2Content) {
      const t = gsap.fromTo(
        panel2Content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'center center',
            toggleActions: 'play none none none',
          },
        }
      )
      if (t.scrollTrigger) triggers.push(t.scrollTrigger)
    }

    return () => { triggers.forEach(st => st.kill()) }
  }, [])

  return (
    <section ref={sectionRef} className="fabric-story-section" data-cursor-text="EXPLORE">
      <div className="fabric-stack-container">

        {/* Panel 1 */}
        <div className="fabric-stack-panel">
          <div className="fabric-bg">
            <Image
              src="/images/fabric_1.webp"
              alt="Ripstop Shell"
              fill
              quality={75}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAABwAQCdASoKAAoABUB8JagCdAFAAAD+7NlvPUCW3xsxPm+GQW6T9aY49hhOSMAA"
              className="fabric-image-cover"
            />
          </div>
          <div className="fabric-content panel-left">
            <p className="features-overline">Material Innovation</p>
            <h2 className="features-title fabric-title">Weightless Armor</h2>
            <p className="editorial-body fabric-desc">
              An ultra-dense micro-ripstop shell that deflects wind and water while maintaining a soft, noiseless drape.
            </p>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="fabric-stack-panel fabric-stack-overlay">
          <div className="fabric-bg fabric-bg-hover">
            <Image
              src="/images/fabric_2.webp"
              alt="Thermal Core"
              fill
              quality={75}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRjAAAABXRUJQVlA4ICQAAABwAQCdASoKAAoABUB8JZQC7AGIQAD+8EIWRYNopoX42mRXAAA="
              className="fabric-image-cover fabric-image-zoom"
            />
            <div className="fabric-scrim"></div>

            <div className="fabric-content panel-center">
              <p className="features-overline">Thermal Core</p>
              <h2 className="features-title fabric-title">Absolute Zero</h2>
              <p className="editorial-body fabric-desc">
                Responsibly sourced 850-fill power down creates an impenetrable thermal barrier against the cold.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
