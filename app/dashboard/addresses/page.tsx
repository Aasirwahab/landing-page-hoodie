'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useState } from 'react'

export default function AddressesPage() {
  const user = useQuery(api.users.getUser)
  const updateProfile = useMutation(api.users.updateProfile)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    label: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'US', isDefault: false,
  })

  const addresses = user?.addresses ?? []

  const handleAdd = async () => {
    if (!form.label || !form.line1 || !form.city || !form.state || !form.zip) {
      alert('Please fill required fields')
      return
    }
    const newAddresses = [...addresses, form]
    await updateProfile({ addresses: newAddresses })
    setForm({ label: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'US', isDefault: false })
    setShowForm(false)
  }

  const handleDelete = async (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index)
    await updateProfile({ addresses: newAddresses })
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none',
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>My Addresses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px', background: '#FF6B35', border: 'none',
            borderRadius: '8px', color: 'white', fontSize: '13px', cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showForm && (
        <div style={{
          padding: '20px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <input placeholder="Label (e.g. Home) *" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} style={inputStyle} />
          <input placeholder="Address Line 1 *" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} style={inputStyle} />
          <input placeholder="Address Line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} style={inputStyle} />
          <div className="address-form-row">
            <input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            <input placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} style={inputStyle} />
          </div>
          <div className="address-form-row">
            <input placeholder="ZIP *" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} style={inputStyle} />
            <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={inputStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            <span style={{ fontSize: '13px' }}>Default address</span>
          </label>
          <button onClick={handleAdd} style={{
            padding: '12px', background: '#FF6B35', border: 'none',
            borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer',
          }}>
            Save Address
          </button>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <p style={{ opacity: 0.4, textAlign: 'center', padding: '40px 0' }}>No saved addresses</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {addresses.map((addr, i) => (
            <div key={i} style={{
              padding: '20px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                  {addr.label}
                  {addr.isDefault && (
                    <span style={{
                      marginLeft: '8px', fontSize: '11px', padding: '2px 8px',
                      background: 'rgba(255,107,53,0.15)', color: '#FF6B35', borderRadius: '10px',
                    }}>
                      Default
                    </span>
                  )}
                </p>
                <p style={{ fontSize: '13px', opacity: 0.6, lineHeight: 1.5 }}>
                  {addr.line1}{addr.line2 && `, ${addr.line2}`}<br />
                  {addr.city}, {addr.state} {addr.zip}, {addr.country}
                </p>
              </div>
              <button onClick={() => handleDelete(i)} style={{
                background: 'none', border: 'none', color: '#f87171',
                cursor: 'pointer', fontSize: '16px',
              }}>
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
