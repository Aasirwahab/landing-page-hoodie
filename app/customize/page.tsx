'use client'

import { useState } from 'react'
import Image from 'next/image'
import PageLayout from '../components/PageLayout'
import { useCartActions } from '../context/CartContext'

const colorOptions = [
  { name: 'Blood Orange', hex: '#FE783D', gradient: 'linear-gradient(to bottom, #FE783D, #121826)', image: '/images/1.png' },
  { name: 'Ocean Blue', hex: '#1E90FF', gradient: 'linear-gradient(to bottom, #1E90FF, #121826)', image: '/images/2.png' },
  { name: 'Royal Purple', hex: '#7B2D8E', gradient: 'linear-gradient(to bottom, #DAB1C8, #511990)', image: '/images/3.png' },
  { name: 'Midnight Black', hex: '#2a2a2a', gradient: 'linear-gradient(to bottom, #444, #121826)', image: '/images/1.png' },
  { name: 'Arctic White', hex: '#e8e8e8', gradient: 'linear-gradient(to bottom, #ddd, #888)', image: '/images/2.png' },
  { name: 'Forest Green', hex: '#2d6a4f', gradient: 'linear-gradient(to bottom, #40916c, #121826)', image: '/images/3.png' },
]

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL']

export default function CustomizePage() {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [selectedSize, setSelectedSize] = useState('M')
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCartActions()

  const handleAddToCart = () => {
    addItem({
      _id: `custom-${selectedColor.name}-${selectedSize}` as any,
      title: 'POSSESSD Custom',
      color: selectedColor.name,
      price: 149900,
      priceFormatted: '$1,499.00',
      background: selectedColor.gradient,
      imageUrl: selectedColor.image,
      thumbBackground: selectedColor.hex,
      slug: `possessd-custom-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`,
      category: 'unisex',
      featured: false,
      inStock: true,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>
            Design Your Own
          </p>
          <h1 style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px' }}>
            CUSTOMISE
          </h1>
          <p style={{ opacity: 0.6, fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            Create your unique POSSESSD jacket. Select your color, size, and make it yours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
          {/* Preview */}
          <div style={{
            borderRadius: '20px', overflow: 'hidden',
            background: selectedColor.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '500px', transition: 'background 0.5s ease',
            position: 'relative',
          }}>
            <Image
              src={selectedColor.image}
              alt="Custom jacket preview"
              width={300}
              height={450}
              style={{
                objectFit: 'contain',
                filter: `hue-rotate(0deg)`,
                transition: 'all 0.3s ease',
              }}
            />
            <div style={{
              position: 'absolute', bottom: '20px', left: '20px',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
              padding: '10px 16px', borderRadius: '8px', fontSize: '13px',
            }}>
              {selectedColor.name} · Size {selectedSize}
            </div>
          </div>

          {/* Options */}
          <div>
            {/* Color */}
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>
                Color: <span style={{ color: '#FF6B35', opacity: 1 }}>{selectedColor.name}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '16px', borderRadius: '12px',
                      border: selectedColor.name === color.name
                        ? '2px solid #FF6B35'
                        : '1px solid rgba(255,255,255,0.1)',
                      background: selectedColor.name === color.name
                        ? 'rgba(255,107,53,0.1)'
                        : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: color.hex, border: '2px solid rgba(255,255,255,0.2)',
                      flexShrink: 0,
                    }}></span>
                    <span style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: '36px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>
                Size: <span style={{ color: '#FF6B35', opacity: 1 }}>{selectedSize}</span>
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '56px', height: '56px', borderRadius: '12px',
                      border: selectedSize === size ? '2px solid #FF6B35' : '1px solid rgba(255,255,255,0.1)',
                      background: selectedSize === size ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.03)',
                      color: 'white', fontSize: '15px', fontWeight: '600',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div style={{
              padding: '24px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '13px', opacity: 0.5, marginBottom: '4px' }}>Custom Price</p>
                  <p style={{ fontSize: '32px', fontWeight: '700', color: '#FF6B35' }}>$1,499.00</p>
                </div>
                <span style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                  background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: '600',
                }}>
                  Made to Order
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                style={{
                  width: '100%', padding: '16px',
                  background: isAdded ? '#4ade80' : 'linear-gradient(135deg, #FF6B35, #e55a2b)',
                  border: 'none', borderRadius: '12px', color: 'white',
                  fontSize: '16px', fontWeight: '700', cursor: isAdded ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {isAdded ? (
                  <><i className="ri-check-line"></i> Added to Cart!</>
                ) : (
                  <><i className="ri-shopping-cart-line"></i> Add Custom Jacket to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
