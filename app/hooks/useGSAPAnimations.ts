'use client'

import { useCallback } from 'react'
import { gsap } from 'gsap'

export const useGSAPAnimations = () => {
  const animateSlideChange = useCallback(() => {
    gsap.from('.swiper-slide-active .slide-title', {
      x: -200,
      opacity: 0,
      duration: 1,
      delay: 0.5
    })

    gsap.from('.swiper-slide-active .info p, .swiper-slide-active .info span', {
      y: 10,
      opacity: 0,
      stagger: 0.1,
      delay: 0.5
    })

    gsap.from('.swiper-slide-active .pricing p, .swiper-slide-active .pricing span, .swiper-slide-active .pricing h3, .swiper-slide-active .btn-block', {
      y: 10,
      opacity: 0,
      stagger: 0.1,
      delay: 0.5
    })

    gsap.from('.swiper-slide-active .main-img', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 1
    })

    gsap.from('.swiper-thumbs', {
      y: 20,
      opacity: 0,
      delay: 0.5
    })
  }, [])

  const animateInitial = useCallback(() => {
    // Wait for DOM to be ready
    setTimeout(() => {
      gsap.from('.slide-title', {
        x: -200,
        opacity: 0,
        duration: 1,
        delay: 0.5
      })

      gsap.from('.info p, .info span', {
        y: 10,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5
      })

      gsap.from('.pricing p, .pricing span, .pricing h3, .btn-block', {
        y: 10,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5
      })

      gsap.from('.main-img', {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 1
      })

      gsap.from('.swiper-thumbs', {
        y: 20,
        opacity: 0,
        delay: 0.5
      })
    }, 500)
  }, [])

  return {
    animateSlideChange,
    animateInitial
  }
} 