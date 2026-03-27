'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function MagneticWrapper({ 
  children, 
  className = '',
  pullX = 0.3,
  pullY = 0.3
}: { 
  children: React.ReactNode, 
  className?: string,
  pullX?: number,
  pullY?: number
}) {
  const magneticRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only apply on desktop
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const element = magneticRef.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)

      gsap.to(element, {
        x: x * pullX,
        y: y * pullY,
        duration: 1,
        ease: 'power3.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [pullX, pullY])

  return (
    <div ref={magneticRef} className={`inline-block magnetic ${className}`}>
      {children}
    </div>
  )
}
