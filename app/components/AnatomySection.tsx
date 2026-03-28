'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function AnatomySection() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)

  const hotspots = [
    { id: 1, top: '35%', left: '48%', title: 'Storm Collar', desc: 'Engineered height for zero wind penetration.' },
    { id: 2, top: '55%', left: '38%', title: 'Thermo-Seamed', desc: 'Waterproof bonded seams block all moisture.' },
    { id: 3, top: '65%', left: '60%', title: 'Utility Pocket', desc: 'Hidden magnetic closure for seamless access.' },
  ]

  return (
    <section className="editorial-section" data-section>
      <div className="editorial-inner relative">
        <div className="editorial-text">
          <p className="features-overline" data-anim="fade-up">The Anatomy</p>
          <h2 className="features-title mb-6" data-anim="fade-up" data-anim-delay="0.1">
            Technical Perfection
          </h2>
          <p className="editorial-body" data-anim="fade-up" data-anim-delay="0.2">
            Every stitch and zipper is engineered for the harshest conditions.
            Hover the markers to explore the proprietary construction that makes POSSESSD gear impenetrable.
          </p>
        </div>

        <div className="anatomy-image-container" data-anim="clip-reveal">
          <Image
            src="/images/anatomy_1.webp"
            alt="Jacket Anatomy"
            fill
            quality={75}
            sizes="(max-width: 768px) 90vw, 50vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoKAAoABUB8JbACdAD0qd34AP2cMd1ISKkr5/wbM2LJc+wwl/1/FDnuHOYLPAAA"
            className="anatomy-image"
          />
          
          {/* Hotspots */}
          {hotspots.map((spot) => (
            <div 
              key={spot.id} 
              className={`hotspot ${activeHotspot === spot.id ? 'active' : ''}`}
              ref={(el) => {
                if (el) {
                  el.style.setProperty('top', spot.top)
                  el.style.setProperty('left', spot.left)
                }
              }}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              <div className="hotspot-dot"></div>
              <div className="hotspot-ring"></div>
              
              <div className="hotspot-tooltip">
                <h4 className="hotspot-title">{spot.title}</h4>
                <p className="hotspot-desc">{spot.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
