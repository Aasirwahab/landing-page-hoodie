'use client'

import React from 'react'
import Image from 'next/image'

export default function FabricSection() {
  return (
    <section className="fabric-story-section" data-section data-cursor-text="EXPLORE">
      <div className="fabric-stack-container">
        
        {/* Panel 1 */}
        <div className="fabric-stack-panel">
          <div className="fabric-bg">
            <Image 
              src="/images/fabric_1.png" 
              alt="Ripstop Shell" 
              fill
              className="fabric-image-cover"
            />
          </div>
          <div className="fabric-content panel-left" data-anim="fade-up">
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
              src="/images/fabric_2.png" 
              alt="Thermal Core" 
              fill
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
