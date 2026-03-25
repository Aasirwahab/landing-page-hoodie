'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as Id<'products'>
  const product = useQuery(api.products.getById, { id: productId })
  const updateProduct = useMutation(api.products.update)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '', color: '', price: '', background: '', thumbBackground: '',
    slug: '', description: '', category: 'unisex' as 'men' | 'women' | 'unisex',
    featured: false, inStock: true,
  })

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        color: product.color,
        price: (product.price / 100).toFixed(2),
        background: product.background,
        thumbBackground: product.thumbBackground,
        slug: product.slug,
        description: product.description || '',
        category: product.category,
        featured: product.featured,
        inStock: product.inStock,
      })
    }
  }, [product])

  if (product === undefined) return <p style={{ opacity: 0.4 }}>Loading...</p>
  if (!product) return <p>Product not found</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const priceInCents = Math.round(parseFloat(form.price) * 100)
      const priceFormatted = `$${parseFloat(form.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

      await updateProduct({
        id: productId,
        title: form.title,
        color: form.color,
        price: priceInCents,
        priceFormatted,
        background: form.background,
        thumbBackground: form.thumbBackground,
        slug: form.slug,
        description: form.description || undefined,
        category: form.category,
        featured: form.featured,
        inStock: form.inStock,
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to update:', error)
      alert('Failed to update product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none',
  }

  const labelStyle = {
    fontSize: '13px', fontWeight: '600' as const, marginBottom: '6px', display: 'block' as const,
    color: 'rgba(255,255,255,0.7)',
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>
        Edit: {product.title} — {product.color}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Color</label>
          <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Price (USD)</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Background Gradient</label>
          <input value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} style={inputStyle} />
          <div style={{ height: '40px', borderRadius: '8px', marginTop: '8px', background: form.background }}></div>
        </div>
        <div>
          <label style={labelStyle}>Thumbnail Background</label>
          <input value={form.thumbBackground} onChange={(e) => setForm({ ...form, thumbBackground: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} style={inputStyle}>
            <option value="unisex">Unisex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <span style={{ fontSize: '14px' }}>Featured</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
            <span style={{ fontSize: '14px' }}>In Stock</span>
          </label>
        </div>
        <button type="submit" disabled={isSubmitting} style={{
          padding: '14px 24px', background: isSubmitting ? 'rgba(255,107,53,0.5)' : '#FF6B35',
          border: 'none', borderRadius: '10px', color: 'white',
          fontSize: '15px', fontWeight: '700', cursor: isSubmitting ? 'wait' : 'pointer',
        }}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
