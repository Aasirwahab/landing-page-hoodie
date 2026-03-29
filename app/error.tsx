'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="status-page">
      <div className="status-page-inner">
        <h1 className="status-page-title">Something went wrong</h1>
        <p className="status-page-description">
          We encountered an unexpected error. Please try again.
        </p>
        <button onClick={reset} className="status-page-btn">
          Try Again
        </button>
      </div>
    </div>
  )
}
