'use client'

import { useState, useEffect } from 'react'

const sizeData = [
  { size: 'XS', chest: '34-36"', waist: '28-30"', hips: '34-36"', eu: '44' },
  { size: 'S', chest: '36-38"', waist: '30-32"', hips: '36-38"', eu: '46' },
  { size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"', eu: '48' },
  { size: 'L', chest: '40-42"', waist: '34-36"', hips: '40-42"', eu: '50' },
  { size: 'XL', chest: '42-44"', waist: '36-38"', hips: '42-44"', eu: '52' },
]

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#1a1a2e',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        border: '1px solid rgba(255,255,255,0.1)',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white' }}>Size Guide</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            fontSize: '24px', cursor: 'pointer',
          }}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <p style={{ fontSize: '13px', opacity: 0.6, marginBottom: '20px' }}>
          All measurements are in inches. For the best fit, measure your body and compare with the chart below.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Size', 'Chest', 'Waist', 'Hips', 'EU'].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '12px', fontWeight: '600', textTransform: 'uppercase',
                  letterSpacing: '1px', opacity: 0.5, color: 'white',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeData.map((row) => (
              <tr key={row.size}>
                <td style={{ padding: '12px 16px', fontWeight: '700', color: '#FF6B35', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.size}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.chest}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.waist}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.hips}</td>
                <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.eu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,107,53,0.1)', borderRadius: '8px', border: '1px solid rgba(255,107,53,0.2)' }}>
          <p style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '600', marginBottom: '4px' }}>
            <i className="ri-information-line"></i> Tip
          </p>
          <p style={{ fontSize: '13px', opacity: 0.7, color: 'white' }}>
            POSSESSD jackets have a relaxed urban fit. If you prefer a snug fit, we recommend sizing down.
          </p>
        </div>
      </div>
    </div>
  )
}
