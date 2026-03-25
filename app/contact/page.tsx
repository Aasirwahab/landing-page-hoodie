'use client'

import { useState } from 'react'
import PageLayout from '../components/PageLayout'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
  }

  return (
    <PageLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.4, marginBottom: '16px' }}>
          Get in Touch
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: '700', letterSpacing: '2px', marginBottom: '12px' }}>
          CONTACT
        </h1>
        <p style={{ opacity: 0.5, fontSize: '15px', marginBottom: '40px' }}>
          Questions about your order, sizing, or anything else? We&apos;d love to hear from you.
        </p>

        {sent ? (
          <div style={{
            padding: '40px', textAlign: 'center', borderRadius: '16px',
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
          }}>
            <i className="ri-check-double-line" style={{ fontSize: '36px', color: '#4ade80' }}></i>
            <h3 style={{ marginTop: '16px', fontSize: '20px', fontWeight: '600' }}>Message Sent!</h3>
            <p style={{ opacity: 0.5, fontSize: '14px', marginTop: '8px' }}>We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
              <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inputStyle} />
            </div>
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={inputStyle} />
            <textarea
              placeholder="Your message *"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' as const }}
            />
            <button type="submit" style={{
              padding: '16px', background: '#FF6B35', border: 'none',
              borderRadius: '10px', color: 'white', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer',
            }}>
              Send Message
            </button>
          </form>
        )}

        <div style={{
          marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'center', gap: '40px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="ri-mail-line" style={{ fontSize: '20px', opacity: 0.4, display: 'block', marginBottom: '8px' }}></i>
            <p style={{ fontSize: '13px', opacity: 0.5 }}>support@possessd.com</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <i className="ri-map-pin-line" style={{ fontSize: '20px', opacity: 0.4, display: 'block', marginBottom: '8px' }}></i>
            <p style={{ fontSize: '13px', opacity: 0.5 }}>New York, NY</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
