'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Thumbs, Mousewheel } from 'swiper/modules'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

import Navigation from './components/Navigation'
import CartSidebar from './components/CartSidebar'
import ProductSlide from './components/ProductSlide'
import { useGSAPAnimations } from './hooks/useGSAPAnimations'
import { fallbackProducts } from './data/products'
import { Product } from './types'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const thumbsSwiper = useRef<any>(null)
  const mainSwiper = useRef<any>(null)
  const { animateSlideChange, animateInitial } = useGSAPAnimations()

  const convexProducts = useQuery(api.products.getFeatured)
  const products: Product[] = convexProducts && convexProducts.length > 0
    ? (convexProducts as Product[])
    : (fallbackProducts as unknown as Product[])

  const isLoading = convexProducts === undefined

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      animateInitial()
    }, 1000)
    return () => clearTimeout(timer)
  }, [animateInitial])

  const handleScrollDown = () => {
    if (mainSwiper.current) {
      mainSwiper.current.slideNext()
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="home-loading" suppressHydrationWarning>
        <div className="home-loading-content">
          <div className="home-loading-emoji">⚡</div>
          <div>Loading POSSESSD Experience...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="swiper-container"
      suppressHydrationWarning
    >
      <Navigation />
      <CartSidebar />

      <Swiper
        modules={[EffectCoverflow, Pagination, Thumbs, Mousewheel]}
        onSwiper={(swiper) => {
          mainSwiper.current = swiper
        }}
        loop={true}
        spaceBetween={0}
        mousewheel={{
          forceToAxis: false,
          sensitivity: 1,
          releaseOnEdges: false,
          thresholdDelta: 50,
          thresholdTime: 500,
        }}
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
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} style={{ background: product.background }}>
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
          <SwiperSlide key={`thumb-${product._id}`} style={{ background: product.thumbBackground }}>
            <Image
              src={product.imageUrl || '/images/1.png'}
              alt={`${product.title} ${product.color}`}
              width={150}
              height={50}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="scroll scroll-trigger"
        onClick={handleScrollDown}
      >
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
