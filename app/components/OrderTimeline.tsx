'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: 'ri-file-list-3-line' },
  { key: 'paid', label: 'Confirmed', icon: 'ri-check-double-line' },
  { key: 'processing', label: 'Processing', icon: 'ri-settings-3-line' },
  { key: 'shipped', label: 'Shipped', icon: 'ri-truck-line' },
  { key: 'delivered', label: 'Delivered', icon: 'ri-home-smile-line' },
]

type StatusEntry = { status: string; timestamp: number; note?: string }

export default function OrderTimeline({
  currentStatus,
  statusHistory,
  creationTime,
  trackingUrl,
  shippingCarrier,
  estimatedDelivery,
}: {
  currentStatus: string
  statusHistory?: StatusEntry[]
  creationTime: number
  trackingUrl?: string
  shippingCarrier?: string
  estimatedDelivery?: number
}) {
  const timelineRef = useRef<HTMLDivElement>(null)

  const isCancelled = currentStatus === 'cancelled'
  const activeStepIndex = STEPS.findIndex((s) => s.key === currentStatus)

  const getTimestamp = (status: string): number | null => {
    if (statusHistory) {
      const entry = statusHistory.find((h) => h.status === status)
      if (entry) return entry.timestamp
    }
    if (status === 'pending') return creationTime
    return null
  }

  const formatDate = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  useEffect(() => {
    if (!timelineRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const steps = timelineRef.current.querySelectorAll('.timeline-step')
    const lines = timelineRef.current.querySelectorAll('.timeline-line')

    gsap.fromTo(
      steps,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    )

    gsap.fromTo(
      lines,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    )
  }, [currentStatus])

  return (
    <div
      ref={timelineRef}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0',
        padding: '24px 0',
        overflowX: 'auto',
      }}
    >
      {STEPS.map((step, i) => {
        const isCompleted = !isCancelled && activeStepIndex >= i
        const isCurrent = step.key === currentStatus
        const timestamp = getTimestamp(step.key)
        const isShippedStep = step.key === 'shipped'

        return (
          <div
            key={step.key}
            style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none' }}
          >
            {/* Step */}
            <div
              className="timeline-step"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '80px',
                opacity: 0,
              }}
            >
              {/* Circle */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCancelled && isCurrent
                    ? 'rgba(248,113,113,0.15)'
                    : isCompleted
                      ? 'rgba(255,107,53,0.15)'
                      : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${
                    isCancelled && isCurrent
                      ? '#f87171'
                      : isCompleted
                        ? '#FF6B35'
                        : 'rgba(255,255,255,0.1)'
                  }`,
                  transition: 'all 0.3s ease',
                  ...(isCurrent && !isCancelled
                    ? {
                        boxShadow: '0 0 12px rgba(255,107,53,0.2)',
                      }
                    : {}),
                }}
              >
                <i
                  className={isCancelled && isCurrent ? 'ri-close-line' : step.icon}
                  style={{
                    fontSize: '16px',
                    color: isCancelled && isCurrent
                      ? '#f87171'
                      : isCompleted
                        ? '#FF6B35'
                        : 'rgba(255,255,255,0.2)',
                  }}
                />
              </div>

              {/* Label */}
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: isCurrent ? '600' : '400',
                  marginTop: '8px',
                  color: isCompleted ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {isCancelled && isCurrent ? 'Cancelled' : step.label}
              </p>

              {/* Timestamp */}
              {timestamp && (
                <p
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: '2px',
                    textAlign: 'center',
                  }}
                >
                  {formatDate(timestamp)}
                  <br />
                  {formatTime(timestamp)}
                </p>
              )}

              {/* Carrier info on shipped step */}
              {isShippedStep && isCompleted && shippingCarrier && (
                <p
                  style={{
                    fontSize: '10px',
                    color: '#FF6B35',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {shippingCarrier}
                </p>
              )}

              {/* Tracking link on shipped step */}
              {isShippedStep && isCompleted && trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '10px',
                    color: '#FF6B35',
                    marginTop: '2px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  Track <i className="ri-external-link-line" style={{ fontSize: '10px' }}></i>
                </a>
              )}

              {/* Estimated delivery on delivered step */}
              {step.key === 'delivered' && !isCompleted && estimatedDelivery && (
                <p
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    marginTop: '2px',
                    textAlign: 'center',
                  }}
                >
                  Est. {formatDate(estimatedDelivery)}
                </p>
              )}
            </div>

            {/* Connecting line */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  height: '36px',
                  padding: '0 4px',
                }}
              >
                <div
                  className="timeline-line"
                  style={{
                    height: '2px',
                    width: '100%',
                    background:
                      !isCancelled && activeStepIndex > i
                        ? '#FF6B35'
                        : 'rgba(255,255,255,0.08)',
                    transformOrigin: 'left center',
                    transition: 'background 0.3s ease',
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
