'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminProductsPage() {
  const products = useQuery(api.products.list, {})
  const removeProduct = useMutation(api.products.remove)

  const handleDelete = async (id: Id<'products'>, title: string, color: string) => {
    if (confirm(`Delete "${title} - ${color}"? This cannot be undone.`)) {
      await removeProduct({ id })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Products</h1>
        <Link
          href="/admin/products/new"
          style={{
            padding: '10px 20px', background: '#FF6B35', borderRadius: '8px',
            color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <i className="ri-add-line"></i> Add Product
        </Link>
      </div>

      {products === undefined ? (
        <p style={{ opacity: 0.4 }}>Loading...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4 }}>
          <p>No products yet. Add your first product.</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Product', 'Color', 'Price', 'Category', 'Stock', 'Featured', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '14px 16px', textAlign: 'left', fontSize: '12px',
                    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
                    opacity: 0.4, borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        background: product.background, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Image
                          src={product.imageUrl || '/images/1.png'}
                          alt={product.title}
                          width={28}
                          height={28}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{product.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {product.color}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {product.priceFormatted}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)', textTransform: 'capitalize' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
                      background: product.inStock ? '#4ade80' : '#f87171', marginRight: '6px',
                    }}></span>
                    <span style={{ fontSize: '13px' }}>{product.inStock ? 'In Stock' : 'Out'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {product.featured ? (
                      <i className="ri-star-fill" style={{ color: '#FFD700' }}></i>
                    ) : (
                      <i className="ri-star-line" style={{ opacity: 0.2 }}></i>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                          background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                          textDecoration: 'none',
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.title, product.color)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12px',
                          background: 'rgba(248,113,113,0.15)', color: '#f87171',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        Delete
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
