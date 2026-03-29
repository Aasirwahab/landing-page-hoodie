'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const isHoveringRef = useRef(false)
  const isMovingRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.body.style.cursor = 'none'

    // Restore cursor on keyboard usage so keyboard users aren't stuck without a cursor
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.style.cursor = 'auto'
      }
    }
    const handleMouseMove = () => {
      document.body.style.cursor = 'none'
    }

    const cursor = cursorRef.current
    const label = cursorLabelRef.current
    if (!cursor || !label) return

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const animate = () => {
      const dx = posRef.current.x - currentRef.current.x
      const dy = posRef.current.y - currentRef.current.y

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        currentRef.current.x = posRef.current.x
        currentRef.current.y = posRef.current.y
        cursor.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`
        isMovingRef.current = false
        rafRef.current = null
        return
      }

      currentRef.current.x = lerp(currentRef.current.x, posRef.current.x, 0.15)
      currentRef.current.y = lerp(currentRef.current.y, posRef.current.y, 0.15)
      cursor.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`
      rafRef.current = requestAnimationFrame(animate)
    }

    const startLoop = () => {
      if (!isMovingRef.current) {
        isMovingRef.current = true
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    const moveCursor = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY
      if (currentRef.current.x === 0 && currentRef.current.y === 0) {
        currentRef.current.x = e.clientX
        currentRef.current.y = e.clientY
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`
      }
      startLoop()
    }

    const handleHoverEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const viewTarget = target.closest('[data-cursor-text]') as HTMLElement
      const isMagnetic = target.closest('.magnetic') || target.closest('button') || target.closest('a')

      if (viewTarget) {
        label.textContent = viewTarget.dataset.cursorText || 'VIEW'
        label.classList.add('visible')
        isHoveringRef.current = true
        cursor.style.setProperty('--cursor-scale', '3.5')
        cursor.classList.add('cursor-text-mode')
      } else if (isMagnetic) {
        isHoveringRef.current = true
        cursor.style.setProperty('--cursor-scale', '1.5')
        cursor.classList.add('cursor-hover-mode')
      }
    }

    const handleHoverLeave = () => {
      isHoveringRef.current = false
      label.textContent = ''
      label.classList.remove('visible')
      cursor.style.setProperty('--cursor-scale', '1')
      cursor.classList.remove('cursor-text-mode', 'cursor-hover-mode')
    }

    const handleDown = () => {
      cursor.style.setProperty('--cursor-scale', isHoveringRef.current ? '1.2' : '0.8')
      startLoop()
    }
    const handleUp = () => {
      cursor.style.setProperty('--cursor-scale', isHoveringRef.current ? '1.5' : '1')
      startLoop()
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('keydown', handleKeyDown)
    document.body.addEventListener('mouseover', handleHoverEnter)
    document.body.addEventListener('mouseout', handleHoverLeave)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.removeEventListener('mouseover', handleHoverEnter)
      document.body.removeEventListener('mouseout', handleHoverLeave)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span ref={cursorLabelRef} className="cursor-label" />
    </div>
  )
}
