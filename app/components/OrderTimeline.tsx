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
    <div ref={timelineRef} className="order-timeline">
      {STEPS.map((step, i) => {
        const isCompleted = !isCancelled && activeStepIndex >= i
        const isCurrent = step.key === currentStatus
        const timestamp = getTimestamp(step.key)
        const isShippedStep = step.key === 'shipped'

        const circleClass = [
          'timeline-circle',
          isCancelled && isCurrent ? 'cancelled' : '',
          isCompleted ? 'completed' : '',
          isCurrent && !isCancelled ? 'current' : '',
        ].filter(Boolean).join(' ')

        const iconColor = isCancelled && isCurrent
          ? '#f87171'
          : isCompleted
            ? '#FF6B35'
            : 'rgba(255,255,255,0.2)'

        return (
          <div
            key={step.key}
            className="timeline-step-wrapper"
            style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}
          >
            {/* Step */}
            <div className="timeline-step">
              {/* Circle */}
              <div className={circleClass}>
                <i
                  className={isCancelled && isCurrent ? 'ri-close-line' : step.icon}
                  style={{ fontSize: '16px', color: iconColor }}
                  aria-hidden="true"
                />
              </div>

              {/* Label */}
              <p className={`timeline-label ${isCurrent ? 'timeline-label--current' : ''} ${isCompleted ? 'timeline-label--completed' : ''}`}>
                {isCancelled && isCurrent ? 'Cancelled' : step.label}
              </p>

              {/* Timestamp */}
              {timestamp && (
                <p className="timeline-timestamp">
                  {formatDate(timestamp)}
                  <br />
                  {formatTime(timestamp)}
                </p>
              )}

              {/* Carrier info on shipped step */}
              {isShippedStep && isCompleted && shippingCarrier && (
                <p className="timeline-carrier">{shippingCarrier}</p>
              )}

              {/* Tracking link on shipped step */}
              {isShippedStep && isCompleted && trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-track-link"
                >
                  Track <i className="ri-external-link-line" style={{ fontSize: '10px' }} aria-hidden="true"></i>
                </a>
              )}

              {/* Estimated delivery on delivered step */}
              {step.key === 'delivered' && !isCompleted && estimatedDelivery && (
                <p className="timeline-timestamp">
                  Est. {formatDate(estimatedDelivery)}
                </p>
              )}
            </div>

            {/* Connecting line */}
            {i < STEPS.length - 1 && (
              <div className="timeline-line-wrapper">
                <div
                  className={`timeline-line ${!isCancelled && activeStepIndex > i ? 'timeline-line--active' : ''}`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
