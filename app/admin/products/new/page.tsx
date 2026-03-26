'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useRouter } from 'next/navigation'

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useMutation(api.products.create)
  const generateUploadUrl = useMutation(api.products.generateUploadUrl)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: 'POSSESSD',
    color: '',
    price: '',
    background: 'linear-gradient(to bottom, #FE783D, #121826)',
    thumbBackground: '#fff',
    slug: '',
    description: '',
    category: 'unisex' as 'men' | 'women' | 'unisex',
    featured: false,
    inStock: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [sizes, setSizes] = useState<{ size: string; inStock: boolean; quantity: number }[]>([
    { size: 'S', inStock: true, quantity: 50 },
    { size: 'M', inStock: true, quantity: 50 },
    { size: 'L', inStock: true, quantity: 50 },
    { size: 'XL', inStock: true, quantity: 50 },
  ])

  const handleColorChange = (color: string) => {
    setForm({
      ...form,
      color,
      slug: `possessd-${color.toLowerCase().replace(/\s+/g, '-')}`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.color || !form.price) {
      alert('Please fill in required fields')
      return
    }
    setIsSubmitting(true)

    try {
      const priceInCents = Math.round(parseFloat(form.price) * 100)
      const priceFormatted = `$${parseFloat(form.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

      let imageStorageId = undefined
      let imageUrl = undefined

      if (imageFile) {
        const uploadUrl = await generateUploadUrl()
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': imageFile.type },
          body: imageFile,
        })
        const { storageId } = await res.json()
        imageStorageId = storageId
      } else {
        imageUrl = '/images/1.png'
      }

      // Upload additional images
      const uploadedImages = []
      for (let i = 0; i < additionalImages.length; i++) {
        const file = additionalImages[i]
        const url = await generateUploadUrl()
        const res2 = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        const { storageId: sid } = await res2.json()
        uploadedImages.push({
          storageId: sid,
          alt: `${form.title} - Image ${i + 2}`,
          sortOrder: i + 1,
        })
      }

      await createProduct({
        title: form.title,
        color: form.color,
        price: priceInCents,
        priceFormatted,
        background: form.background,
        imageStorageId,
        imageUrl,
        thumbBackground: form.thumbBackground,
        slug: form.slug || `possessd-${form.color.toLowerCase().replace(/\s+/g, '-')}`,
        description: form.description || undefined,
        category: form.category,
        featured: form.featured,
        inStock: form.inStock,
        sizes: sizes.length > 0 ? sizes : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product. Please try again.')
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
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Add Product</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Color *</label>
          <input value={form.color} onChange={(e) => handleColorChange(e.target.value)} placeholder="e.g. Blood Orange" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Price (USD) *</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1249.00" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Background Gradient</label>
          <input value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} style={inputStyle} />
          <div style={{ height: '40px', borderRadius: '8px', marginTop: '8px', background: form.background }}></div>
        </div>

        <div>
          <label style={labelStyle}>Thumbnail Background Color</label>
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
          <label style={labelStyle}>Product Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            style={{ ...inputStyle, padding: '10px' }} />
        </div>

        <div>
          <label style={labelStyle}>Additional Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setAdditionalImages(Array.from(e.target.files || []))}
            style={{ ...inputStyle, padding: '10px' }}
          />
          {additionalImages.length > 0 && (
            <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>
              {additionalImages.length} additional image(s) selected
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} style={inputStyle}>
            <option value="unisex">Unisex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        {/* Sizes & Inventory */}
        <div>
          <label style={labelStyle}>Sizes & Inventory</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sizes.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  value={s.size}
                  onChange={(e) => {
                    const updated = [...sizes]
                    updated[i] = { ...updated[i], size: e.target.value }
                    setSizes(updated)
                  }}
                  placeholder="Size"
                  style={{ ...inputStyle, width: '80px' }}
                />
                <input
                  type="number"
                  value={s.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value) || 0
                    const updated = [...sizes]
                    updated[i] = { ...updated[i], quantity: qty, inStock: qty > 0 }
                    setSizes(updated)
                  }}
                  placeholder="Qty"
                  style={{ ...inputStyle, width: '100px' }}
                />
                <span style={{ fontSize: '12px', opacity: 0.5 }}>units</span>
                <button
                  type="button"
                  onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))}
                  style={{
                    background: 'rgba(248,113,113,0.15)', border: 'none', borderRadius: '6px',
                    color: '#f87171', padding: '8px 10px', cursor: 'pointer', fontSize: '14px',
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSizes([...sizes, { size: '', inStock: true, quantity: 50 }])}
              style={{
                padding: '8px 16px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              <i className="ri-add-line"></i> Add Size
            </button>
          </div>
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

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '14px 24px', background: isSubmitting ? 'rgba(255,107,53,0.5)' : '#FF6B35',
            border: 'none', borderRadius: '10px', color: 'white',
            fontSize: '15px', fontWeight: '700', cursor: isSubmitting ? 'wait' : 'pointer',
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
