import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="status-page">
      <div className="status-page-inner">
        <p className="status-page-overline">404 Error</p>
        <h1 className="status-page-title">Page Not Found</h1>
        <p className="status-page-description">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="status-page-btn">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
