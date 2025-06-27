'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Thumbs, Mousewheel } from 'swiper/modules'
import Image from 'next/image'

// Import components
import Navigation from './components/Navigation'
import ProductSlide from './components/ProductSlide'
import { useGSAPAnimations } from './hooks/useGSAPAnimations'
import { products } from './data/products'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const thumbsSwiper = useRef<any>(null)
  const { animateSlideChange, animateInitial } = useGSAPAnimations()

  useEffect(() => {
    console.log('🚀 Moncler page mounting...')
    console.log('📦 Products:', products)
    setMounted(true)
    
    // Delay animations until everything is loaded
    const timer = setTimeout(() => {
      animateInitial()
    }, 1000)

    return () => clearTimeout(timer)
  }, [animateInitial])

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #FE783D, #121826)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        zIndex: 9999
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚡</div>
          <div>Loading Moncler Experience...</div>
        </div>
      </div>
    )
  }

  console.log('✅ Rendering Moncler page with', products.length, 'products')

  return (
    <div className="swiper-container" style={{ 
      width: '100vw', 
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Navigation />

      <Swiper
        modules={[EffectCoverflow, Pagination, Thumbs, Mousewheel]}
        loop={true}
        spaceBetween={0}
        mousewheel={true}
        speed={1200}
        effect="coverflow"
        direction="vertical"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 10,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
        thumbs={{
          swiper: thumbsSwiper.current && !thumbsSwiper.current.destroyed ? thumbsSwiper.current : null
        }}
        onSlideChangeTransitionStart={animateSlideChange}
        className="swiper"
        style={{ width: '100%', height: '100%' }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} style={{ background: product.background }}>
            <ProductSlide product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={(swiper) => {
          thumbsSwiper.current = swiper
        }}
        slidesPerView={2}
        spaceBetween={0}
        className="swiper-thumbs"
      >
        {products.map((product) => (
          <SwiperSlide key={`thumb-${product.id}`} style={{ background: product.thumbBackground }}>
            <Image
              src={product.image}
              alt={`Thumbnail ${product.id}`}
              width={150}
              height={50}
              style={{ objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="scroll">
        Scroll Down <i className="ri-arrow-down-s-line"></i>
      </div>
      
      <div className="social">
        <a href="#" aria-label="LinkedIn">IN</a>
        <a href="#" aria-label="Facebook">FB</a>
        <a href="#" aria-label="Twitter">TW</a>
      </div>
    </div>
  )
} 