'use client'

import Image from 'next/image'
import { Product } from '../types'

interface ProductSlideProps {
  product: Product
}

export default function ProductSlide({ product }: ProductSlideProps) {
  return (
    <>
      <h2>{product.title}</h2>
      
      <div className="info">
        <p>FALL 2023</p>
        <span>@ Urban elegance <br /> meets innovation</span>
        <p>MONCLER GENIUS</p>
        <span>Bold, modern, <br /> and technical</span>
      </div>
      
      <div className="pricing">
        <p>Color:</p>
        <span>{product.color}</span>
        <h3>{product.price}</h3>
        <div className="btn-block">
          <button className="light-btn">Buy Now</button>
          <button className="btn">Add To Cart</button>
        </div>
      </div>
      
      <Image
        src={product.image}
        alt={product.title}
        className="main-img"
        width={400}
        height={600}
        priority
      />
    </>
  )
} 