'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function AdminSettingsPage() {
  const settings = useQuery(api.settings.getAll)
  const saveBatch = useMutation(api.settings.setBatch)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    shippingFlatRate: '',
    freeShippingThreshold: '',
    taxRate: '',
    shippingEnabled: 'true',
    storeName: '',
    storeEmail: '',
  })

  useEffect(() => {
    if (settings) {
      setForm({
        shippingFlatRate: String(Number(settings.shippingFlatRate) / 100),
        freeShippingThreshold: String(Number(settings.freeShippingThreshold) / 100),
        taxRate: settings.taxRate,
        shippingEnabled: settings.shippingEnabled,
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
      })
    }
  }, [settings])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveBatch({
        settings: [
          { key: 'shippingFlatRate', value: String(Math.round(parseFloat(form.shippingFlatRate || '0') * 100)) },
          { key: 'freeShippingThreshold', value: String(Math.round(parseFloat(form.freeShippingThreshold || '0') * 100)) },
          { key: 'taxRate', value: form.taxRate || '0' },
          { key: 'shippingEnabled', value: form.shippingEnabled },
          { key: 'storeName', value: form.storeName },
          { key: 'storeEmail', value: form.storeEmail },
        ],
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) return <p style={{ opacity: 0.4 }}>Loading...</p>

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600' as const,
    marginBottom: '6px',
    display: 'block' as const,
    color: 'rgba(255,255,255,0.7)',
  }

  const cardStyle = {
    padding: '24px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '24px',
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Settings</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '10px 24px',
            background: saved ? '#4ade80' : isSaving ? 'rgba(255,107,53,0.5)' : '#FF6B35',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSaving ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.3s',
          }}
        >
          <i className={saved ? 'ri-check-line' : 'ri-save-line'}></i>
          {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Store Info */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ri-store-2-line" style={{ color: '#FF6B35' }}></i>
          Store Information
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Store Name</label>
            <input
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Contact Email</label>
            <input
              type="email"
              value={form.storeEmail}
              onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
              placeholder="store@example.com"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ri-truck-line" style={{ color: '#3b82f6' }}></i>
          Shipping
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.shippingEnabled === 'true'}
                onChange={(e) => setForm({ ...form, shippingEnabled: e.target.checked ? 'true' : 'false' })}
                style={{ width: '16px', height: '16px', accentColor: '#FF6B35' }}
              />
              Enable shipping charges
            </label>
            <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px', marginLeft: '26px' }}>
              When disabled, all orders ship for free
            </p>
          </div>

          {form.shippingEnabled === 'true' && (
            <>
              <div>
                <label style={labelStyle}>Flat Rate Shipping ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.shippingFlatRate}
                  onChange={(e) => setForm({ ...form, shippingFlatRate: e.target.value })}
                  placeholder="9.99"
                  style={inputStyle}
                />
                <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px' }}>
                  Fixed shipping cost per order
                </p>
              </div>
              <div>
                <label style={labelStyle}>Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.freeShippingThreshold}
                  onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                  placeholder="100.00"
                  style={inputStyle}
                />
                <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px' }}>
                  Orders above this amount get free shipping. Set to 0 to disable.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tax */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ri-percent-line" style={{ color: '#4ade80' }}></i>
          Tax
        </h2>
        <div>
          <label style={labelStyle}>Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
            placeholder="8"
            style={inputStyle}
          />
          <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '4px' }}>
            Applied to all orders. Set to 0 for no tax.
          </p>
        </div>
      </div>
    </div>
  )
}
