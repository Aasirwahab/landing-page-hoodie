'use client'

import { useCallback } from 'react'
import { gsap } from 'gsap'

export const usePageAnimations = () => {
  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const staggerCards = useCallback((selector: string, delay = 0) => {
    if (prefersReduced()) {
      gsap.set(selector, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      selector,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay }
    )
  }, [])

  const countUp = useCallback(
    (element: HTMLElement, target: number, duration = 1) => {
      if (prefersReduced()) {
        element.textContent = target.toFixed(2)
        return
      }
      gsap.fromTo(
        element,
        { textContent: 0 },
        {
          textContent: target,
          duration,
          ease: 'power2.out',
          snap: { textContent: 0.01 },
          onUpdate: function () {
            const val = parseFloat(element.textContent || '0')
            element.textContent = val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          },
        }
      )
    },
    []
  )

  const slideIn = useCallback((selector: string, direction: 'left' | 'right' | 'up' | 'down' = 'up', delay = 0) => {
    if (prefersReduced()) {
      gsap.set(selector, { opacity: 1, x: 0, y: 0 })
      return
    }
    const props: Record<string, number> = { opacity: 0 }
    if (direction === 'up') props.y = 20
    if (direction === 'down') props.y = -20
    if (direction === 'left') props.x = -30
    if (direction === 'right') props.x = 30

    gsap.fromTo(selector, props, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay,
    })
  }, [])

  const fadeInSequence = useCallback((selectors: string[]) => {
    if (prefersReduced()) {
      selectors.forEach((sel) => gsap.set(sel, { opacity: 1, y: 0 }))
      return
    }
    selectors.forEach((sel, i) => {
      gsap.fromTo(
        sel,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.12 }
      )
    })
  }, [])

  return { staggerCards, countUp, slideIn, fadeInSequence }
}
