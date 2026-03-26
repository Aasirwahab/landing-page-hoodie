'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import StarRating from './StarRating'

interface ReviewSectionProps {
  productId: Id<"products">
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, isSignedIn } = useUser()
  const reviews = useQuery(api.reviews.getByProduct, { productId })
  const avgRating = useQuery(api.reviews.getAverageRating, { productId })
  const userReview = useQuery(api.reviews.getUserReview, { productId })
  const submitReview = useMutation(api.reviews.submit)

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      await submitReview({ productId, rating, text: text.trim() || undefined })
      setSubmitted(true)
      setRating(0)
      setText('')
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      marginTop: '80px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      paddingTop: '40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '1px' }}>
          Reviews
        </h2>
        {avgRating && avgRating.count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={avgRating.average} size={18} />
            <span style={{ fontSize: '15px', opacity: 0.7 }}>
              {avgRating.average} ({avgRating.count} {avgRating.count === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {isSignedIn && !userReview && !submitted && (
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Write a Review
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>
              Your Rating
            </label>
            <StarRating rating={rating} size={24} interactive onChange={setRating} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>
              Your Review (optional)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || submitting}
            style={{
              padding: '12px 28px',
              background: rating === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FF6B35, #e55a2b)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: rating === 0 ? 'not-allowed' : 'pointer',
              opacity: rating === 0 ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {submitted && (
        <div style={{
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          fontSize: '14px',
          color: '#4ade80',
        }}>
          <i className="ri-check-line" style={{ marginRight: '8px' }}></i>
          Thank you! Your review has been submitted and is pending approval.
        </div>
      )}

      {userReview && !submitted && (
        <div style={{
          background: 'rgba(255,107,53,0.08)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <StarRating rating={userReview.rating} size={14} />
          <span style={{ opacity: 0.7 }}>
            {userReview.approved
              ? 'You reviewed this product'
              : 'Your review is pending approval'}
          </span>
        </div>
      )}

      {!isSignedIn && (
        <p style={{
          fontSize: '14px',
          opacity: 0.5,
          marginBottom: '32px',
        }}>
          <a href="/sign-in" style={{ color: '#FF6B35', textDecoration: 'underline' }}>Sign in</a> to write a review.
        </p>
      )}

      {/* Review List */}
      {reviews && reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,107,53,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FF6B35',
                  }}>
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{review.userName}</span>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              {review.text && (
                <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.7, marginTop: '8px' }}>
                  {review.text}
                </p>
              )}
              <p style={{ fontSize: '11px', opacity: 0.3, marginTop: '12px' }}>
                {new Date(review._creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '14px', opacity: 0.4, textAlign: 'center', padding: '40px 0' }}>
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  )
}
