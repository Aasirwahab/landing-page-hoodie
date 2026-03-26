'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

export default function AdminCouponsPage() {
  const coupons = useQuery(api.coupons.getAll)
  const createCoupon = useMutation(api.coupons.create)
  const updateCoupon = useMutation(api.coupons.update)
  const removeCoupon = useMutation(api.coupons.remove)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<Id<'coupons'> | null>(null)
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
    active: true,
  })

  const resetForm = () => {
    setForm({ code: '', type: 'percentage', value: '', minOrderAmount: '', maxUses: '', expiresAt: '', active: true })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.value) return
    const data = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: form.type === 'percentage' ? parseFloat(form.value) : Math.round(parseFloat(form.value) * 100),
      active: form.active,
      ...(form.minOrderAmount ? { minOrderAmount: Math.round(parseFloat(form.minOrderAmount) * 100) } : {}),
      ...(form.maxUses ? { maxUses: parseInt(form.maxUses) } : {}),
      ...(form.expiresAt ? { expiresAt: new Date(form.expiresAt).getTime() } : {}),
    }

    if (editingId) {
      await updateCoupon({ id: editingId, ...data })
    } else {
      await createCoupon(data)
    }
    resetForm()
  }

  const startEdit = (coupon: NonNullable<typeof coupons>[number]) => {
    setEditingId(coupon._id)
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.type === 'percentage' ? String(coupon.value) : String(coupon.value / 100),
      minOrderAmount: coupon.minOrderAmount ? String(coupon.minOrderAmount / 100) : '',
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      active: coupon.active,
    })
    setShowForm(true)
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

  const inputStyle = {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Coupons</h1>
          <p style={{ fontSize: '14px', opacity: 0.4, marginTop: '4px' }}>
            {coupons ? `${coupons.length} coupon${coupons.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          style={{
            padding: '10px 20px', background: '#FF6B35', border: 'none',
            borderRadius: '8px', color: 'white', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '6px',
          }}
        >
          <i className="ri-add-line"></i> New Coupon
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div style={{
          padding: '24px', borderRadius: '12px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            {editingId ? 'Edit Coupon' : 'Create Coupon'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME20"
                style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '1px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>
                Value * {form.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'percentage' ? '20' : '10.00'}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>Min Order ($)</label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                placeholder="Optional"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>Max Uses</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Unlimited"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', opacity: 0.5, marginBottom: '6px', display: 'block' }}>Expires</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#FF6B35' }}
              />
              Active
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 24px', background: '#FF6B35', border: 'none',
                borderRadius: '8px', color: 'white', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            <button
              onClick={resetForm}
              style={{
                padding: '10px 24px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                color: 'white', fontSize: '14px', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      {coupons === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : coupons.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <i className="ri-coupon-line" style={{ fontSize: '48px', opacity: 0.15 }}></i>
          <p style={{ marginTop: '12px', opacity: 0.4 }}>No coupons yet</p>
        </div>
      ) : (
        <div style={{
          borderRadius: '12px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, fontWeight: '600',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', letterSpacing: '1px', fontWeight: '600' }}>
                    {c.code}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', opacity: 0.6, textTransform: 'capitalize' }}>
                    {c.type}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600' }}>
                    {c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', opacity: 0.5 }}>
                    {c.minOrderAmount ? formatPrice(c.minOrderAmount) : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                    {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', opacity: 0.5 }}>
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                      background: c.active ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                      color: c.active ? '#4ade80' : 'rgba(255,255,255,0.3)',
                    }}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => startEdit(c)}
                        style={{
                          padding: '6px 10px', background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                          color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer',
                        }}
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this coupon?')) removeCoupon({ id: c._id }) }}
                        style={{
                          padding: '6px 10px', background: 'rgba(248,113,113,0.08)',
                          border: '1px solid rgba(248,113,113,0.15)', borderRadius: '6px',
                          color: '#f87171', fontSize: '12px', cursor: 'pointer',
                        }}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
