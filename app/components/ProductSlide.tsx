'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types'
import { useCartActions } from '../context/CartContext'
import { useState } from 'react'
import ToastNotification, { useToast } from './ToastNotification'

interface ProductSlideProps {
  product: Product
}

export default function ProductSlide({ product }: ProductSlideProps) {
  const { addItem, toggleCart } = useCartActions()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast, showToast, hideToast } = useToast()

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    addItem(product)
    showToast(
      `${product.title} (${product.color}) added to cart!`,
      'success',
      product.color
    )
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const handleBuyNow = () => {
    addItem(product)
    showToast(
      `${product.title} added to cart! Opening cart...`,
      'success',
      product.color
    )
    setTimeout(() => {
      toggleCart()
    }, 600)
  }

  return (
    <>
      <h2>{product.title}</h2>

      <div className="info">
        <p>FALL 2025</p>
        <span>@ Urban elegance <br /> meets innovation</span>
        <p>POSSESSD COLLECTION</p>
        <span>Bold, modern, <br /> and technical</span>
      </div>

      <div className="pricing">
        <p>Color:</p>
        <span>{product.color}</span>
        <h3>{product.priceFormatted}</h3>
        <div className="btn-block">
          <button
            className="light-btn"
            onClick={handleBuyNow}
            disabled={isAddingToCart}
          >
            <i className="ri-shopping-cart-line"></i> Buy Now
          </button>
          <button
            className="btn"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <i className="ri-check-line"></i> Added!
              </>
            ) : (
              <>
                <i className="ri-add-line"></i> Add To Cart
              </>
            )}
          </button>
        </div>
        <Link
          href={`/products/${product.slug}`}
          style={{
            display: 'inline-block',
            marginTop: '12px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          View Details →
        </Link>
      </div>

      <Image
        src={product.imageUrl || '/images/1.webp'}
        alt={`${product.title} - ${product.color}`}
        className="main-img"
        width={400}
        height={600}
        priority
      />

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        productColor={toast.productColor}
        customStyle={toast.customStyle}
      />
    </>
  )
}
