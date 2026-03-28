'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    // Hide default cursor on desktop
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      document.body.style.cursor = 'none'
    } else {
      // Don't initialize custom cursor on touch devices
      return
    }

    const cursor = cursorRef.current
    const label = cursorLabelRef.current
    if (!cursor || !label) return

    // Position cursor quickly to avoid initial flash
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const handleHoverEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const viewTarget = target.closest('[data-cursor-text]') as HTMLElement
      const isMagnetic = target.closest('.magnetic') || target.closest('button') || target.closest('a')

      if (viewTarget) {
        label.textContent = viewTarget.dataset.cursorText || 'VIEW'
        label.classList.add('visible')
        isHoveringRef.current = true
        gsap.to(cursor, { scale: 3.5, backgroundColor: 'rgba(255, 69, 0, 0.9)', duration: 0.3 })
      } else if (isMagnetic) {
        isHoveringRef.current = true
        gsap.to(cursor, { scale: 1.5, backgroundColor: 'transparent', border: '1px solid rgba(255, 69, 0, 0.8)', duration: 0.3 })
      }
    }

    const handleHoverLeave = () => {
      isHoveringRef.current = false
      label.textContent = ''
      label.classList.remove('visible')
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '#fff',
        border: 'none',
        duration: 0.3,
      })
    }

    const handleDown = () => {
      gsap.to(cursor, { scale: isHoveringRef.current ? 1.2 : 0.8, duration: 0.1 })
    }
    const handleUp = () => {
      gsap.to(cursor, { scale: isHoveringRef.current ? 1.5 : 1, duration: 0.1 })
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    document.body.addEventListener('mouseover', handleHoverEnter)
    document.body.addEventListener('mouseout', handleHoverLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.body.removeEventListener('mouseover', handleHoverEnter)
      document.body.removeEventListener('mouseout', handleHoverLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor">
      <span ref={cursorLabelRef} className="cursor-label" />
    </div>
  )
}
