'use client'

import { useRef, useEffect } from 'react'

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
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const element = magneticRef.current
    if (!element) return

    // Use direct CSS transforms — no GSAP tween per mousemove
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number | null = null
    let isActive = false

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1)
      currentY = lerp(currentY, targetY, 0.1)
      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`

      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        rafId = requestAnimationFrame(animate)
      } else {
        element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
        isActive = false
        rafId = null
      }
    }

    const startAnimation = () => {
      if (!isActive) {
        isActive = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = element.getBoundingClientRect()
      targetX = (clientX - (left + width / 2)) * pullX
      targetY = (clientY - (top + height / 2)) * pullY
      startAnimation()
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      startAnimation()
    }

    element.addEventListener('mousemove', handleMouseMove, { passive: true })
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [pullX, pullY])

  return (
    <div ref={magneticRef} className={`inline-block magnetic ${className}`}>
      {children}
    </div>
  )
}
