'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import StarRating from '../../components/StarRating'

type Tab = 'pending' | 'approved' | 'all'

export default function AdminReviewsPage() {
  const allReviews = useQuery(api.reviews.getAll)
  const approveReview = useMutation(api.reviews.approve)
  const rejectReview = useMutation(api.reviews.reject)
  const [activeTab, setActiveTab] = useState<Tab>('pending')

  const filteredReviews = allReviews?.filter((r) => {
    if (activeTab === 'pending') return !r.approved
    if (activeTab === 'approved') return r.approved
    return true
  })

  const pendingCount = allReviews?.filter((r) => !r.approved).length ?? 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '1px' }}>Reviews</h1>
          <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '4px' }}>
            Manage product reviews
          </p>
        </div>
        {pendingCount > 0 && (
          <span style={{
            background: 'rgba(255,107,53,0.15)',
            color: '#FF6B35',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {(['pending', 'approved', 'all'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
              border: activeTab === tab ? '1px solid rgba(255,107,53,0.3)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              color: activeTab === tab ? '#FF6B35' : 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      {!allReviews ? (
        <p style={{ opacity: 0.5 }}>Loading reviews...</p>
      ) : filteredReviews && filteredReviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          opacity: 0.4,
        }}>
          <i className="ri-star-line" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
          No {activeTab === 'all' ? '' : activeTab} reviews
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReviews?.map((review) => (
            <div
              key={review._id}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{review.userName}</span>
                  <span style={{ fontSize: '12px', opacity: 0.4 }}>on</span>
                  <span style={{ fontSize: '14px', color: '#FF6B35' }}>{review.productTitle}</span>
                  <StarRating rating={review.rating} size={14} />
                </div>
                {review.text && (
                  <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.5 }}>{review.text}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', opacity: 0.3 }}>
                    {new Date(review._creationTime).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: review.approved ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                    color: review.approved ? '#4ade80' : '#fbbf24',
                  }}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {!review.approved && (
                  <button
                    onClick={() => approveReview({ id: review._id })}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      borderRadius: '8px',
                      color: '#4ade80',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <i className="ri-check-line"></i> Approve
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this review?')) {
                      rejectReview({ id: review._id })
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="ri-delete-bin-line"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
