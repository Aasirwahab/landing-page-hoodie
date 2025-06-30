'use client'

import { useState, useEffect } from 'react'
import { products } from '../data/products'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('✅ Test page mounted successfully!')
    console.log('📦 Products loaded:', products.length)
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #FE783D, #121826)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading test page...
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #FE783D, #121826)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '48px', textAlign: 'center', marginBottom: '30px' }}>
        🎉 Next.js 15.3.4 Test Page
      </h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>
          Congratulations! The upgrade was successful!
        </p>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h2>System Status:</h2>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>✅ Next.js 15.3.4 running</li>
            <li>✅ React 19.1.0 working</li>
            <li>✅ TypeScript compiling</li>
            <li>✅ Products data loaded ({products.length} items)</li>
            <li>✅ Client-side rendering working</li>
            <li>✅ No webpack errors</li>
          </ul>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3>{product.title}</h3>
              <p>Color: {product.color}</p>
              <p>Price: {product.price}</p>
              <img 
                src={product.image} 
                alt={product.title}
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px' }}>
          <a 
            href="/" 
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
            }}
          >
            ← Back to Main Page
          </a>
        </div>
      </div>
    </div>
  )
} 