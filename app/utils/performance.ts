// Performance optimization utilities
export const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

// Web Vitals reporting
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // You can send metrics to your analytics service here
    console.log(metric)
  }
} 